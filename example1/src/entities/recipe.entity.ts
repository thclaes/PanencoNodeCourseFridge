import {
  BaseEntity,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { v4 } from "uuid";
import { ProductRecipe } from "./productRecipe.entity";
import { User } from "./user.entity";

@Entity()
export class Recipe extends BaseEntity<Recipe, "id"> {
  @PrimaryKey({ columnType: "uuid" })
  public id: string = v4();

  @Property({ nullable: true })
  public name: string;

  @Property({ nullable: true })
  public description: string;

  @ManyToOne({ entity: () => User, nullable: true })
  public owner?: User;

  @OneToMany({ entity: () => ProductRecipe, mappedBy: "recipe" })
  public productRecipes: Collection<ProductRecipe>;
}
