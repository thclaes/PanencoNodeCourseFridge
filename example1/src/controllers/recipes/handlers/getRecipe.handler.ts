import { RequestContext } from "@mikro-orm/core";
import { Recipe } from "../../../entities/recipe.entity";

export const get = async (id: string): Promise<Recipe> => {
  const em = RequestContext.getEntityManager();
  const recipe = await em.findOneOrFail(
    Recipe,
    { id: id },
    { populate: ["owner", "productRecipes.product"] }
  );

  return recipe;
};
