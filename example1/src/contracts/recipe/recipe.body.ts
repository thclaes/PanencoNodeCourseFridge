import { Exclude, Expose, Type } from "class-transformer";
import { IsString } from "class-validator";
import { User } from "../../entities/user.entity";
import { ProductAmount } from "./productAmount";

@Exclude()
export class RecipeBody {
  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public description: string;

  @Expose()
  @Type(() => User)
  public owner?: User;

  @Expose()
  @Type(() => ProductAmount)
  public productAmounts: ProductAmount[];
}
