import { RequestContext } from "@mikro-orm/core";
import { RecipeBody } from "../../../contracts/recipe/recipe.body";
import { Recipe } from "../../../entities/recipe.entity";
import { User } from "../../../entities/user.entity";
import { createProductRecipe } from "../../productRecipes/handlers/createProductRecipe.handler";

export const create = async (body: RecipeBody, userId: string): Promise<Recipe> => {
  const em = RequestContext.getEntityManager();

  const createEntity: Recipe = {
    name: body.name,
    description: body.description,
  } as Recipe;

  const user = await em.findOneOrFail(User, {id: userId});

  const recipe = em.create(Recipe, createEntity);
  recipe.owner = user;

  await em.persist(recipe);


  //throws error or executes
  await createProductRecipe(recipe, body.productAmounts);

  return recipe;
};
