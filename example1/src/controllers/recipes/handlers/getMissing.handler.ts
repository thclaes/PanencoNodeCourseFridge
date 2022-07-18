import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity";
import { ProductRecipe } from "../../../entities/productRecipe.entity";

export const getMissingIngredients = async (
  userId: string,
  recipeId: string
): Promise<[Product[], number]> => {
  const em = RequestContext.getEntityManager();

  const storedProds = await em.find(Product, {
    owner: userId,
  });

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
    .filter((prodRec) => {
      if (storedProds.some((x) => x.name == `${prodRec.product.name}`)) {
        return !(
          storedProds.find((x) => x.name === prodRec.product.name).size >=
          prodRec.amount
        );
      }
      return true;
    })
    .map((prodRec) => prodRec.product);

  return [res, res.length];
};
