import { RequestContext } from "@mikro-orm/core";
import { Recipe } from "../../../entities/recipe.entity";

export const deleteRecipe = async (idString: string) => {
  const em = RequestContext.getEntityManager();
  const recipe = await em.findOneOrFail(
    Recipe,
    { id: idString },
    { populate: ["owner", "productRecipes"] }
  );

  await em.removeAndFlush(recipe);
};
