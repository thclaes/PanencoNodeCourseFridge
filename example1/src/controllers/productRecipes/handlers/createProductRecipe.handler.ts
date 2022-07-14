import { RequestContext } from "@mikro-orm/core";
import { NotFound } from "@panenco/papi";
import { ProductAmount } from "../../../contracts/recipe/productAmount";
import { Product } from "../../../entities/product.entity";
import { ProductRecipe } from "../../../entities/productRecipe.entity";
import { Recipe } from "../../../entities/recipe.entity";

export const createProductRecipe = async (
  recipe: Recipe,
  productAmount: ProductAmount[]
): Promise<void> => {
  const em = RequestContext.getEntityManager();
  const unknownProducts: string[] = [];

  await Promise.all(
    productAmount.map(async (productAmount) => {
      let product: Product;

      try {
        product = await em.findOneOrFail(Product, {
          id: productAmount.product_id,
        });
      } catch (e) {
        unknownProducts.push(productAmount.product_id);
      }

      try {
        const prRemove = await em.findOneOrFail(ProductRecipe, {
          product: product,
          recipe: recipe,
        });
        prRemove.amount = productAmount.amount;
      } catch (e) {
        const productRecipe = em.create(ProductRecipe, {
          product: product,
          recipe: recipe,
          amount: productAmount.amount,
        });

        em.persist(productRecipe);
      }
    })
  );

  if (!(unknownProducts.length > 0)) {
    await em.flush();
  } else {
    throw new NotFound(
      `entityNotFound`,
      `Following products do not exist: ${unknownProducts.toString()}`
    );
  }
};
