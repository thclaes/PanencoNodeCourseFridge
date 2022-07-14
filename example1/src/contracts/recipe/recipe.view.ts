import { Exclude, Expose, Type } from "class-transformer";
import { IsString } from "class-validator";
import { User } from "../../entities/user.entity";
import { ProductAmountView } from "./productAmount.view";

@Exclude()
export class RecipeView {
  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public description: string;

  @Expose()
  @Type(() => User)
  public owner: User;

  @Expose()
  @Type(() => ProductAmountView)
  public productAmount: ProductAmountView[];
}
