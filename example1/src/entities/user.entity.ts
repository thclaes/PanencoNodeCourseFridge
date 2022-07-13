import {
  BaseEntity,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { v4 } from "uuid";
import { Product } from "./product.entity";
import { Recipe } from "./recipe.entity";

@Entity()
export class User extends BaseEntity<User, "id"> {
  @PrimaryKey({ columnType: "uuid" })
  public id: string = v4();

  @Property()
  public name: string;

  @Property({ unique: true })
  public email: string;

  @Property()
  public password: string;

  @OneToMany({ entity: () => Product, mappedBy: "owner" })
  public products: Collection<Product>;

  @OneToMany({ entity: () => Recipe, mappedBy: "owner" })
  public recipes: Collection<Recipe>;
}
