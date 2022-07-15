import { RequestContext } from "@mikro-orm/core";
import { NotFound } from "@panenco/papi";
import { ProductAmount } from "../../../contracts/recipe/productAmount";
import { Product } from "../../../entities/product.entity";
import { ProductRecipe } from "../../../entities/productRecipe.entity";
import { Recipe } from "../../../entities/recipe.entity";

export const createProductRecipe = async (
  recipe: Recipe,
  productAmounts: ProductAmount[]
): Promise<void> => {
  const em = RequestContext.getEntityManager();
  const unknownProducts: string[] = [];

  await Promise.all(
    productAmounts.map(async (productAmount) => {
      let product: Product;

      try {
        product = await em.findOneOrFail(
          Product,
          {
            id: productAmount.product_id,
          },
          {
            populate: ["owner"],
          }
        );
        if (product.owner) {
          throw new Error(
            "The given product has an owner, and thus is not a type!"
          );
        }
      } catch (e) {
        unknownProducts.push(productAmount.product_id);
      }

      if (product && !product.owner) {
        const existingProductRecipes = await em.find(ProductRecipe, {
          recipe: recipe,
        });
        em.remove(existingProductRecipes);

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
