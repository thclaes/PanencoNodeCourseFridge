import { RequestContext } from "@mikro-orm/core";
import { RecipeBody } from "../../../contracts/recipe/recipe.body";
import { Recipe } from "../../../entities/recipe.entity";
import { createProductRecipe } from "../../productRecipes/handlers/createProductRecipe.handler";

export const update = async (id: string, body: RecipeBody): Promise<Recipe> => {
  const em = RequestContext.getEntityManager();

  const recipe = await em.findOneOrFail(Recipe, { id: id });

  const res = recipe.assign(body);

  //throws error or executes
  await createProductRecipe(recipe, body.productAmounts);

  return res;
};
