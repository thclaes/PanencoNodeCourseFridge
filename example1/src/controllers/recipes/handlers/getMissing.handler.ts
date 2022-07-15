// import { RequestContext } from "@mikro-orm/core";
// import { Product } from "../../../entities/product.entity";
// import { ProductRecipe } from "../../../entities/productRecipe.entity";
// import { Recipe } from "../../../entities/recipe.entity";

// export const getMissingIngredients = async (
//   userId: string,
//   recipeId: string
// ): Promise<Product[]> => {
//   const em = RequestContext.getEntityManager();

//   const storedProds = await em.find(Product, {
//     owner: userId,
//   });

//   const neededProds = await em.find(
//     ProductRecipe,
//     {
//       recipe: recipeId,
//     },
//     {
//       populate: ["product"],
//     }
//   );

//   neededProds.reduce((prodRec) => {
//     return
//   })
// };
