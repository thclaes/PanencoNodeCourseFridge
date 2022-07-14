import { Collection } from "@mikro-orm/core";
import { Exclude, Expose, Type } from "class-transformer";
import { IsString } from "class-validator";
import { ProductRecipe } from "../../entities/productRecipe.entity";

// For safety we'll exclude everything from being transformed by placing a @Exclude() decorator on the class declaration
@Exclude()
export class RecipeBody {
  // We can expose the properties we want included one by one
  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public description: string;

  @Expose()
  @IsString()
  public size: string;

  @Expose()
  @Type(() => ProductRecipe)
  public productRecipes: Collection<ProductRecipe>;
}
