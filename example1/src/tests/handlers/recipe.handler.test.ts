import { expect } from "chai";
import {
  Connection,
  EntityManager,
  IDatabaseDriver,
  MikroORM,
  RequestContext,
} from "@mikro-orm/core";
import { PostgreSqlDriver, SqlEntityManager } from "@mikro-orm/postgresql";
import { App } from "../../app";
import { User } from "../../entities/user.entity";
import { v4 } from "uuid";
import { Recipe } from "../../entities/recipe.entity";
import { getList } from "../../controllers/recipes/handlers/getListRecipe.handler";
import { get } from "../../controllers/recipes/handlers/getRecipe.handler";
import { create } from "../../controllers/recipes/handlers/createRecipe.handler";
import { RecipeBody } from "../../contracts/recipe/recipe.body";
import { update } from "../../controllers/recipes/handlers/updateRecipe.handler";
import { deleteRecipe } from "../../controllers/recipes/handlers/deleteRecipe.handler";
import { Product } from "../../entities/product.entity";
import { ProductAmount } from "../../contracts/recipe/productAmount";
import { ProductRecipe } from "../../entities/productRecipe.entity";

const recipeFixtures: Recipe[] = [
  {
    name: "Gesneden appel",
    description: "Appel in stukjes gesneden",
  } as Recipe,
  {
    name: "Owned recipe",
    description: "Recipe in bezit van user",
    owner: {
      name: "fredje",
      email: "fredje@hotmail.com",
      password: "randompass",
    } as User,
  } as Recipe,
  {
    name: "Spaghetti",
    description: "test-user+1@panenco.com",
  } as Recipe,
];

const productFixtures: Product[] = [
  {
    type: "food",
    name: "test",
    size: 5,
  } as Product,
  {
    type: "drink",
    name: "test1",
    size: 10,
  } as Product,
];

describe("Handler tests recipe", () => {
  describe("recipe Tests", () => {
    let orm: MikroORM<PostgreSqlDriver>;
    let em: SqlEntityManager<PostgreSqlDriver> &
      EntityManager<IDatabaseDriver<Connection>>;
    let recipes: Recipe[];
    let products: Product[] = [];

    before(async () => {
      const app = new App();
      await app.createConnection();

      orm = app.orm;
      em = orm.em.fork();
    });

    beforeEach(async () => {
      await em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
      await orm.getMigrator().up();

      recipeFixtures.forEach((recipe) => {
        const recipeDb = em.create(Recipe, recipe);
        em.persist(recipeDb);
      });

      products = productFixtures.map((productDb) =>
        em.create(Product, productDb)
      );
      em.persist(products);

      await em.flush();
      recipes = await em.find(Recipe, {});
      em.clear();
    });

    it("should get recipes", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {
        const [res, total] = await getList();

        expect(total).equal(3);
        expect(res.some((x) => x.name === "Gesneden appel")).true;
      });
    });

    it("should get recipe by id", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {
        const res = await get(recipes[1].id);

        expect(res.name == recipes[1].name).true;
        expect(res.description == recipes[1].description).true;
        // check if containing users?
        // check if containing recipes?
      });
    });

    it("should contain recipes in get by id", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {
        const prodRec: ProductRecipe = await em.create(ProductRecipe, {
          recipe: recipes[1],
          product: products[0],
          amount: 1,
        });
        em.persist(prodRec);
        await em.flush();

        const res = await get(recipes[1].id);
        expect(res.productAmounts[0].product.id).equals(products[0].id);
      });
    });

    it("should fail when getting recipe by unknown id", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {
        try {
          await get(v4());
        } catch (error) {
          expect(error.message).equal("Recipe NotFound");
          return;
        }
        expect(true, "should have thrown an error").false;
      });
    });

    it("should create recipe", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {
        const body = {
          name: "test recept",
          description: "Dit is een test recept",
          productAmounts: [
            {
              product_id: products[0].id,
              amount: 10,
            } as ProductAmount,
          ],
        } as RecipeBody;
        const res = await create(body);

        expect(res.name).equals(body.name);
        expect(res.description).equals(body.description);

        const forkEm = orm.em.fork();
        expect(await forkEm.count(Recipe, { name: body.name })).equal(1);
        expect(await forkEm.count(ProductRecipe, {})).equal(1);
      });
    });

    it("should not create recipe if unknown product", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {
        const body = {
          name: "test recept",
          description: "Dit is een test recept",
          productAmounts: [
            {
              product_id: v4(),
              amount: 10,
            } as ProductAmount,
          ],
        } as RecipeBody;
        try {
          await create(body);
        } catch (error) {
          expect(error.message).contain("Following products do not exist");
          return;
        }
        expect(true, "should have thrown an error").false;
      });
    });

    // To write when user-part is done
    // it("should not create recipe if product has owner", async () => {
    //   await RequestContext.createAsync(orm.em.fork(), async () => {
    //     const body = {
    //       name: "test recept",
    //       description: "Dit is een test recept",
    //       productAmounts: [
    //         {
    //           product_id: v4(),
    //           amount: 10,
    //         } as ProductAmount,
    //       ],
    //     } as RecipeBody;
    //     try {
    //       await create(body);
    //     } catch (error) {
    //       expect(error.message).contain("Following products do not exist");
    //       return;
    //     }
    //     expect(true, "should have thrown an error").false;
    //   });
    // });

    it("should update recipe", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {
        const body1 = {
          description: "Dit is een test recept update",
          productAmounts: [
            {
              product_id: products[0].id,
              amount: 10,
            } as ProductAmount,
            {
              product_id: products[1].id,
              amount: 15,
            } as ProductAmount,
          ],
        } as RecipeBody;
        const id1 = recipes[0].id;
        const res1 = await update(id1, body1);

        expect(res1.description).equals(body1.description);

        expect(
          await em.count(Recipe, { description: body1.description })
        ).equal(1);
        expect((await em.findOne(Recipe, { id: id1 })).description).equal(
          "Dit is een test recept update"
        );
        expect((await em.find(ProductRecipe, {})).length).equal(2);

        const body2 = {
          productAmounts: [
            {
              product_id: products[0].id,
              amount: 25,
            } as ProductAmount,
          ],
        } as RecipeBody;
        const id2 = recipes[0].id;
        await update(id2, body2);

        expect(
          await (
            await em.find(ProductRecipe, { amount: 25 })
          ).length
        ).equals(1);
        expect(await (await em.find(ProductRecipe, {})).length).equals(1);
      });
    });

    it("should delete recipe", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {
        const id = recipes[1].id;

        await deleteRecipe(id);

        const forkEm = orm.em.fork();
        expect(await forkEm.findOne(Recipe, { id })).equal(null);
      });
    });
  });
});
