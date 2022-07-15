import { RequestContext } from "@mikro-orm/core";
import { ProductRecipe } from "../../../entities/productRecipe.entity";
import { Recipe } from "../../../entities/recipe.entity";

export const deleteRecipe = async (idString: string) => {
  const em = RequestContext.getEntityManager();
  const recipe = await em.findOneOrFail(
    Recipe,
    { id: idString },
    { populate: ["owner", "productRecipes"] }
  );

  const productRecipes = await em.find(ProductRecipe, {
    recipe:recipe.id
  });
  await em.removeAndFlush(productRecipes);
  await em.removeAndFlush(recipe);
};
