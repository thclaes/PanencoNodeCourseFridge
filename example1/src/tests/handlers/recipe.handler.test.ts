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
import { getMissingIngredients } from "../../controllers/recipes/handlers/getMissing.handler";


const userFixture = {
  name: "Cas",
  email: "cas@mail.com",
  password: "password"
}
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
const productWithOwnerFixture =   {
  type: "drink",
  name: "test2",
  size: 10,
} as Product

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

      const userDb = em.create(User, userFixture);
      em.persist(userDb);

      recipeFixtures.forEach((recipe) => {
        const recipeDb = em.create(Recipe, recipe);
        recipeDb.owner = userDb;
        em.persist(recipeDb);
      });

      products = productFixtures.map((productFixture) => {
        const productDb = em.create(Product, productFixture)
        return productDb;
      }
      );
      em.persist(products);

      const productDbWithOwner = em.create(Product, productWithOwnerFixture);
      productDbWithOwner.owner = userDb;
      em.persist(productDbWithOwner);

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
        expect(res.owner.name == userFixture.name).true;
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
        const users = await em.find(User, {});
        const res = await create(body, users[0].id);

        expect(res.name).equals(body.name);
        expect(res.description).equals(body.description);
        expect(res.owner.name).equals(userFixture.name);

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
          const users = await em.find(User, {});
          await create(body, users[0].id);
        } catch (error) {
          expect(error.message).contain("Following products do not exist");
          return;
        }
        expect(true, "should have thrown an error").false;
      });
    });

    it("should not create recipe if product has owner", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {
        const prod = await em.find(Product, {$not: {owner: null}})
        const body = {
          name: "test recept",
          description: "Dit is een test recept",
          productAmounts: [
            {
              product_id: prod[0].id,
              amount: 10,
            } as ProductAmount,
          ],
        } as RecipeBody;
        try {
          const users = await em.find(User, {});
          await create(body, users[0].id);
        } catch (error) {
          expect(error.message).contain("Following products do not exist");
          return;
        }
        expect(true, "should have thrown an error").false;
      });
    });

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

    it("should return missing products", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {
        const user = await em.create(User, {
          name: "testuser",
          email: "testuser@mail.net",
          password: "allowedpassword",
        });
        em.persist(user);

        const productType = em.create(Product, {
          type: "food",
          name: "appel",
          size: 5,
        } as Product);
        em.persist(productType);

        const product = em.create(Product, {
          type: "food",
          name: "test",
          size: 5,
          owner: user,
        });
        em.persist(product);
        await em.flush();

        const recipe = await em.findOne(Recipe, { name: "Spaghetti" });

        const productRec1 = em.create(ProductRecipe, {
          product: products[0],
          recipe: recipe,
          amount: 5,
        });

        const productRec2 = await em.create(ProductRecipe, {
          product: products[1],
          recipe: recipe,
          amount: 5,
        });

        const productRec3 = await em.create(ProductRecipe, {
          product: productType,
          recipe: recipe,
          amount: 5,
        });
        await em.persistAndFlush([productRec1, productRec2, productRec3]);

        const neededProducts = await getMissingIngredients(user.id, recipe.id);
        expect(neededProducts.length).equals(2);
        expect(neededProducts.some((x) => x.id == productType.id)).true;
        expect(neededProducts.some((x) => x.id == products[0].id)).false;
        expect(neededProducts.some((x) => x.id == products[1].id)).true;
      });
    });
  });
});
