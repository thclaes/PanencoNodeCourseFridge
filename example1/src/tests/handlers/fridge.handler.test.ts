import { expect } from "chai";
import { getList } from "../../controllers/users/handlers/getList.handler";
import { get } from "../../controllers/users/handlers/get.handler";
import { create } from "../../controllers/users/handlers/create.handler";
import { update } from "../../controllers/users/handlers/update.handler";
import { deleteUser } from "../../controllers/users/handlers/delete.handler";
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
import { Fridge } from "../../entities/fridge.entity";
import { Product } from "../../entities/product.entity";
import { getAllProductsFromFridge } from "../../controllers/fridges/handlers/getFridge.handler";
import e from "express";

const fridgeFixture: Fridge = {
    location: "testLocation",
    capacity: 100,
} as Fridge
const productFixture: Product = {
    type: "testType",
    name: "testName",
    size: 1
} as Product

describe("Handler tests", () => {
  describe("Fridge Tests", () => {
    let orm: MikroORM<PostgreSqlDriver>;
    let em: SqlEntityManager<PostgreSqlDriver> &
      EntityManager<IDatabaseDriver<Connection>>;
    let users: User[];

    before(async () => {
      const app = new App();
      await app.createConnection();

      orm = app.orm;
      em = orm.em.fork();
    });

    beforeEach(async () => {
        await em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
        await orm.getMigrator().up();

        const fridgeDb = em.create(Fridge, fridgeFixture);
        const productDb = em.create(Product, productFixture);
        productDb.fridge = fridgeDb;
        em.persist(fridgeDb);
        em.persist(productDb);
        await em.flush();
        // users = await em.find(User, {});
        // em.clear();
    });

    it("should get product", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {
        const fridges = await em.find(Fridge, {});
        const [res, total] = await getAllProductsFromFridge(fridges[0].id);
        expect(total).equal(1);
        expect(res.some((x) => x.name === "testName")).true;
      });
    });

    // it("should search users", async () => {
    //   await RequestContext.createAsync(orm.em.fork(), async () => {
    //     const [res, total] = await getList("test1");

    //     expect(total).equal(1);
    //     expect(res.some((x) => x.name === "test1")).true;
    //   });
    // });

    // it("should get user by id", async () => {
    //   await RequestContext.createAsync(orm.em.fork(), async () => {
    //     const res = await get(users[0].id);

    //     expect(res.name == users[0].name).true;
    //     expect(res.email == users[0].email).true;
    //   });
    // });

    // it("should fail when getting user by unknown id", async () => {
    //   await RequestContext.createAsync(orm.em.fork(), async () => {
    //     try {
    //       await get(v4());
    //     } catch (error) {
    //       expect(error.message).equal("User NotFound");
    //       return;
    //     }
    //     expect(true, "should have thrown an error").false;
    //   });
    // });

    // it("should create user", async () => {
    //   await RequestContext.createAsync(orm.em.fork(), async () => {
    //     const body = {
    //       email: "test-user+new@panenco.com",
    //       name: "newUser",
    //       password: "reallysecretstuff",
    //     } as User;
    //     const res = await create(body);

    //     expect(res.name).equals(body.name);
    //     expect(res.email).equals(body.email);

    //     const forkEm = orm.em.fork();
    //     expect(await forkEm.count(User, { name: body.name })).equal(1);
    //   });
    // });

    // it("should update user", async () => {
    //   await RequestContext.createAsync(orm.em.fork(), async () => {
    //     const body = {
    //       email: "test-user+updated@panenco.com",
    //     } as User;
    //     const id = users[0].id;
    //     const res = await update(id, body);

    //     expect(res.email).equals(body.email);

    //     expect(await em.count(User, { email: body.email })).equal(1);
    //     expect((await em.findOne(User, { id })).email).equal(
    //       "test-user+updated@panenco.com"
    //     );
    //   });
    // });

    // it("should delete user", async () => {
    //   await RequestContext.createAsync(orm.em.fork(), async () => {
    //     const id = users[1].id;

    //     await deleteUser(id);

    //     const forkEm = orm.em.fork();
    //     expect(await forkEm.findOne(User, { id })).equal(null);
    //   });
    // });
  });
});
