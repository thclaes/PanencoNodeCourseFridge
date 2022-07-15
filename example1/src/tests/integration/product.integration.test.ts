import { MikroORM, RequestContext } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { StatusCode } from "@panenco/papi";
import { expect } from "chai";
import supertest from "supertest";
import { App } from "../../app";
import { FridgeBody } from "../../contracts/fridge.body";
import { LoginBody } from "../../contracts/login.body";
import { ProductBody } from "../../contracts/product/product.body";
import { UserBody } from "../../contracts/user.body";
import { User } from "../../entities/user.entity";

describe("Integration tests", () => {
  describe("Product Tests", async () => {
    let request: supertest.SuperTest<supertest.Test>;
    let orm: MikroORM<PostgreSqlDriver>;
    let token;
    let user;

    before(async () => {
      const app = new App();
      await app.createConnection();
      orm = app.orm;
      request = supertest(app.host);
    });

    beforeEach(async () => {
      await orm.em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
      await orm.getMigrator().up();

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
    });

    it("crud", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {

        //CREATE
        const {body: createdFridge} = await request
          .post(`/api/fridge/`)
          .send({location: "testLocation", capacity: 100} as FridgeBody)
          .set("x-auth", token)
          .expect(StatusCode.created);

        const {body: createdProduct} = await request
          .post(`/api/product/`)
          .send({type: "food", name: "steak", size: 1, fridgeId: createdFridge.id, userId: user.id} as ProductBody)
          .set("x-auth", token)
          .expect(StatusCode.created);

          //GET
          const {body: newProduct} = await request
          .get(`/api/product/` + createdProduct.id)
          .set("x-auth", token)
          .expect(StatusCode.ok);
          
          expect(newProduct.fridge.id).equal(createdFridge.id);

          const {body: newFridge} = await request
          .get(`/api/fridge/` + createdFridge.id)
          .set("x-auth", token)
          .expect(StatusCode.ok);

          expect(newFridge.products[0].id).equal(createdProduct.id);

          const {body: newFridges} = await request
          .get(`/api/fridge/`)
          .set("x-auth", token)
          .expect(StatusCode.ok);
          expect(newFridges.items[0].products[0].id).equal(createdProduct.id);

          //DELETE
          const {body: msg} = await request
          .delete(`/api/product/` + createdProduct.id)
          .set("x-auth", token)
          .expect(StatusCode.noContent);
          
          const {body: nothing} = await request
          .get(`/api/product/` + createdProduct.id)
          .set("x-auth", token)
          .expect(StatusCode.notFound);
        
      });
    });
  });
});
