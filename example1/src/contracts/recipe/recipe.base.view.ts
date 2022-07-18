import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";
@Exclude()
export class RecipeBaseView {
  @Expose()
  @IsString()
  public id: string;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public description: string;
}
