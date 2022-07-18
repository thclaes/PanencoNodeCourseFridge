import { MikroORM, RequestContext } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { StatusCode } from "@panenco/papi";
import { expect } from "chai";
import supertest from "supertest";
import { App } from "../../app";
import { FridgeBody } from "../../contracts/fridge.body";
import { LoginBody } from "../../contracts/login.body";
import { ProductBody } from "../../contracts/product/product.body";
import { RecipeBody } from "../../contracts/recipe/recipe.body";
import { UserBody } from "../../contracts/user.body";
import { Product } from "../../entities/product.entity";
import { User } from "../../entities/user.entity";

describe("Integration tests recipe", () => {
  describe("Product Tests", async () => {
    let request: supertest.SuperTest<supertest.Test>;
    let orm: MikroORM<PostgreSqlDriver>;
    let token;
    let user;
    let fridge;
    let productType;

    before(async () => {
      const app = new App();
      await app.createConnection();
      orm = app.orm;
      request = supertest(app.host);
    });

    beforeEach(async () => {
      await orm.em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
      await orm.getMigrator().up();

      productType = await orm.em.create(Product, {
        type: "food",
        name: "tomato",
        size: 1,
      });
      await orm.em.persistAndFlush(productType);

      const body: UserBody = {
        name: "test",
        email: "test-user+1@panenco.com",
        password: "real secret stuff",
      };
      const login: LoginBody = {
        email: "test-user+1@panenco.com",
        password: "real secret stuff",
      };

      const { body: createdUser } = await request
        .post(`/api/users`)
        .send(body)
        .expect(StatusCode.created);

      user = createdUser;

      const { body: auth } = await request
        .post("/api/auth/tokens")
        .send(login)
        .expect(StatusCode.ok);

      token = auth.token;

      const { body: createdFridge } = await request
        .post(`/api/fridge/`)
        .send({ location: "testLocation", capacity: 100 } as FridgeBody)
        .set("x-auth", token)
        .expect(StatusCode.created);

      fridge = createdFridge;
    });

    it("crud", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {
        //CREATE
        const { body: createdRecipe } = await request
          .post(`/api/recipes/`)
          .send({
            name: "pasta",
            description: "nice pasta",
            productAmounts: [{ product_id: productType.id, amount: 1 }],
          } as RecipeBody)
          .set("x-auth", token)
          .expect(StatusCode.created);

        //GET
        const { body: newRecipe } = await request
          .get(`/api/recipes/` + createdRecipe.id)
          .set("x-auth", token)
          .expect(StatusCode.ok);
        expect(newRecipe.name).equals("pasta");

        const { body: newRecipes } = await request
          .get(`/api/recipes/`)
          .set("x-auth", token)
          .expect(StatusCode.ok);
        expect(newRecipes.items[0].name).equals("pasta");

        const { body: missingProducts } = await request
          .get(`/api/recipes/${createdRecipe.id}/missingIngredients`)
          .set("x-auth", token)
          .expect(StatusCode.ok);
        expect(missingProducts.items[0].name).equals("tomato");

        //PATCH
        const { body: updatedRecipe } = await request
          .patch(`/api/recipes/` + createdRecipe.id)
          .send({
            name: "large pasta",
            description: "nice pasta",
            productAmounts: [{ product_id: productType.id, amount: 10 }],
          } as RecipeBody)
          .set("x-auth", token)
          .expect(StatusCode.ok);
        expect(updatedRecipe.name).equals("large pasta");

        //DELETE
        const { body: msg } = await request
          .delete(`/api/recipes/` + createdRecipe.id)
          .set("x-auth", token)
          .expect(StatusCode.noContent);

        const { body: nothing } = await request
          .get(`/api/recipes/` + createdRecipe.id)
          .set("x-auth", token)
          .expect(StatusCode.notFound);
      });
    });
  });
});
