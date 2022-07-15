import { Exclude, Expose, Type } from "class-transformer";
import { ProductAmountView } from "./productAmount.view";
import { UserView } from "../user.view";
import { RecipeBaseView } from "./recipe.base.view";

@Exclude()
export class RecipeView extends RecipeBaseView {
  @Expose()
  @Type(() => UserView)
  public owner?: UserView;

  @Expose()
  @Type(() => ProductAmountView)
  public productAmounts: ProductAmountView[];
}
