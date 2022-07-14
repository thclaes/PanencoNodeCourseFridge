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
import { v4 } from "uuid";
import { getProduct } from "../../controllers/products/handlers/getProduct.handler";
import { createProduct } from "../../controllers/products/handlers/createProduct.handler";
import { User } from "../../entities/user.entity";
import { deleteProduct } from "../../controllers/products/handlers/deleteProduct.handler";

const getFridgeFixture = (nb: number): Fridge => {
    return {
        location: "testLocation" + nb,
        capacity: nb * 100,
    } as Fridge
}
const getProductFixture = (nb: number): Product => {
    return {
        type: "testType",
        name: "testName" + nb,
        size: nb
    } as Product
}
const userFixture = {
    name: "Cas",
    email: "cas@mail.com",
    password: "password"
}


describe("Handler tests", () => {
  describe("Product Tests", () => {
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

        em.persist(em.create(User, userFixture));

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

    it("should get product", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {
        const products = await em.find(Product, {});
        const product = await getProduct(products[0].id);
        expect(product.name).equal(products[0].name);
      });
    });

    it("should fail when getting product by unknown id", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {
        try {
          await getProduct(v4());
        } catch (error) {
          expect(error.message).equal("Product NotFound");
          return;
        }
        expect(true, "should have thrown an error").false;
      });
    });

    it("should create one product", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {
        const fridges = await em.find(Fridge, {});
        const users = await em.find(User, {});

            const newProduct = getProductFixture(10);
            const res = await createProduct({...newProduct, fridgeId: fridges[0].id, userId: users[0].id} as any);
    
            expect(res.name).equals(newProduct.name);
            expect(res.fridge.id).equals(fridges[0].id);
            expect(res.owner.id).equals(users[0].id);
    
            const forkEm = orm.em.fork();
            expect(await forkEm.count(Product, { name: newProduct.name })).equal(1);
      });
  });


      it("should delete product", async () => {
        await RequestContext.createAsync(orm.em.fork(), async () => {
          const products = await em.find(Product, {});
  
          await deleteProduct(products[0].id);
  
          const forkEm = orm.em.fork();
          expect(await forkEm.findOne(User, { id: products[0].id })).equal(null);
        });
      });
  });
});