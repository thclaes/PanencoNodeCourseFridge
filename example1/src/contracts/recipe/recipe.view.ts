import { Exclude, Expose, Type } from "class-transformer";
import { IsString } from "class-validator";
import { ProductAmountView } from "./productAmount.view";
import { UserView } from "../user.view";

@Exclude()
export class RecipeView {
  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public description: string;

  @Expose()
  @Type(() => UserView)
  public owner?: UserView;

  @Expose()
  @Type(() => ProductAmountView)
  public productAmount: ProductAmountView[];
}
