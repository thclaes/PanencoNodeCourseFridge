import { RequestContext } from "@mikro-orm/core";
import { RecipeView } from "../../../contracts/recipe/recipe.view";
import { Recipe } from "../../../entities/recipe.entity";
import { ProductAmountView } from "../../../contracts/recipe/productAmount.view";
import { ProductAmount } from "../../../contracts/recipe/productAmount";

export const get = async (id: string): Promise<RecipeView> => {
  const em = RequestContext.getEntityManager();
  const recipe = await em.findOneOrFail(
    Recipe,
    { id: id },
    { populate: ["owner", "productRecipes.product"] }
  );

  const productAmounts: ProductAmountView[] = recipe.productRecipes
    .getItems()
    .map((productRecipe) => {
      return <ProductAmountView>{
        product: productRecipe.product,
        amount: productRecipe.amount,
      };
    });

  const result: RecipeView = {
    name: recipe.name,
    description: recipe.description,
    owner: recipe.owner,
    productAmounts: productAmounts,
  };

  return result;
};
