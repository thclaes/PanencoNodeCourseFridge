import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { v4 } from "uuid";
import { Product } from "./product.entity";
import { Recipe } from "./recipe.entity";

@Entity()
export class ProductRecipe extends BaseEntity<ProductRecipe, "id"> {
  @PrimaryKey({ columnType: "uuid" })
  public id: string = v4();

  @Property()
  public amount: number;

  @ManyToOne({ entity: () => Product })
  public product: Product;

  @ManyToOne({ entity: () => Recipe })
  public recipe: Recipe;
}
