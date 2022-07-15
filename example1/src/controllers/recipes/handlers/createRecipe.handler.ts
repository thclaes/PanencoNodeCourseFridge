import { RequestContext } from "@mikro-orm/core";
import { RecipeBody } from "../../../contracts/recipe/recipe.body";
import { Recipe } from "../../../entities/recipe.entity";
import { createProductRecipe } from "../../productRecipes/handlers/createProductRecipe.handler";

export const create = async (body: RecipeBody): Promise<Recipe> => {
  const em = RequestContext.getEntityManager();

  // setOwner?
  const createEntity: Recipe = {
    name: body.name,
    description: body.description,
  } as Recipe;

  const recipe = em.create(Recipe, createEntity);
  await em.persist(recipe);

  //throws error or executes
  await createProductRecipe(recipe, body.productAmounts);

  return recipe;
};
