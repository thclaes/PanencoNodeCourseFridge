import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity";
import { ProductRecipe } from "../../../entities/productRecipe.entity";

export const getMissingIngredients = async (
  userId: string,
  recipeId: string
): Promise<Product[]> => {
  const em = RequestContext.getEntityManager();

  const storedProds = (
    await em.find(Product, {
      owner: userId,
    })
  ).map((prod) => prod.name);

  const neededProds = await em.find(
    ProductRecipe,
    {
      recipe: recipeId,
    },
    {
      populate: ["product"],
    }
  );

  const res = neededProds
    .filter((prodRec) =>
      storedProds.some((x) => x !== `${prodRec.product.name}`)
    )
    .map((prodRec) => prodRec.product);

  return res;
};
