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
import { Fridge } from "./fridge.entity";
import { ProductRecipe } from "./productRecipe.entity";
import { User } from "./user.entity";

@Entity()
export class Product extends BaseEntity<Product, "id"> {
  @PrimaryKey({ columnType: "uuid" })
  public id: string = v4();

  @Property({ nullable: true })
  public type: string;

  @Property({ nullable: true })
  public name: string;

  @Property({ nullable: true })
  public size?: number;

  @ManyToOne({ entity: () => Fridge, nullable: true })
  public fridge?: Fridge;

  @ManyToOne({ entity: () => User, nullable: true })
  public owner?: User;

  @OneToMany({ entity: () => ProductRecipe, mappedBy: "product" })
  public productRecipes: Collection<ProductRecipe>;
}
