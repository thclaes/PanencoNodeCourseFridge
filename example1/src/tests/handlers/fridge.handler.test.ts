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
import { Fridge } from "../../entities/fridge.entity";
import { Product } from "../../entities/product.entity";
import { getFridge } from "../../controllers/fridges/handlers/getFridge.handler";
import { getAllFridges } from "../../controllers/fridges/handlers/getAllFridge.handler";
import { v4 } from "uuid";
import { createFridge } from "../../controllers/fridges/handlers/createFridge.handler";
import { FridgeBody } from "../../contracts/fridge.body";

const getFridgeFixture = (nb: number): Fridge => {
    return {
        location: "testLocation" + nb,
        capacity: nb * 100,
    } as Fridge
}
const getProductFixture = (nb: number): Product => {
    return {
        type: "testType" + nb,
        name: "testName" + nb,
        size: nb
    } as Product
}

describe("Handler tests", () => {
  describe("Fridge Tests", () => {
    let orm: MikroORM<PostgreSqlDriver>;
    let em: SqlEntityManager<PostgreSqlDriver> &
      EntityManager<IDatabaseDriver<Connection>>;
    const nbFridges = 2;
    const nbProductsPerFridge = 5;

    before(async () => {
      const app = new App();
      await app.createConnection();

      orm = app.orm;
      em = orm.em.fork();
    });

    beforeEach(async () => {
        await em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
        await orm.getMigrator().up();

        for (let i = 0; i < nbFridges; i++) {
            const fridgeDb = em.create(Fridge, getFridgeFixture(i));
            em.persist(fridgeDb);
            for (let j = 0; j < nbProductsPerFridge; j++) {
                const productDb = em.create(Product, getProductFixture(j));
                productDb.fridge = fridgeDb;
                em.persist(productDb);
            }
        }
        await em.flush();
    });

    it("should get (products from) fridge", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {
        const fridges = await em.find(Fridge, {});
        const fridge = await getFridge(fridges[0].id);
        expect(fridge.products.length).equal(nbProductsPerFridge);
        expect(fridge.location).equal("testLocation0");
      });
    });

    it("should fail when getting (products by) unknown fridge id", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {
        try {
          await getFridge(v4());
        } catch (error) {
          expect(error.message).equal("Fridge NotFound");
          return;
        }
        expect(true, "should have thrown an error").false;
      });
    });

    it("should get (products from) all fridges", async () => {
        await RequestContext.createAsync(orm.em.fork(), async () => {
          const [res, total] = await getAllFridges();
          expect(total).equal(nbFridges);
          expect(res[0].products.length).equal(nbProductsPerFridge);
          expect(res.some((x) => x.location === "testLocation0")).true;
        });
    });

    it("should get (products from) all fridges in location", async () => {
        await RequestContext.createAsync(orm.em.fork(), async () => {
          const [res, total] = await getAllFridges("testLocation0");
          expect(total).equal(1);
          expect(res[0].products.length).equal(nbProductsPerFridge);
          expect(res.some((x) => x.location === "testLocation0")).true;
        });
    });
    it("should create one empty fridge", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {
          const newFridge = getFridgeFixture(10);
          const res = await createFridge(newFridge as FridgeBody);
  
          expect(res.location).equals(newFridge.location);
          expect(res.capacity).equals(newFridge.capacity);
  
          const forkEm = orm.em.fork();
          expect(await forkEm.count(Fridge, { location: newFridge.location })).equal(1);

          const fridge = await getFridge(res.id);
          expect(fridge.products.length).equal(0);
      });
  });
  });
});