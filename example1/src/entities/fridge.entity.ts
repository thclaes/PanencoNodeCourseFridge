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

@Entity()
export class Fridge extends BaseEntity<Fridge, "id"> {
  @PrimaryKey({ columnType: "uuid" })
  public id: string = v4();

  @Property({ nullable: true })
  public location: string;

  @Property({ nullable: true })
  public capacity: number;

  @OneToMany({ entity: () => Product, mappedBy: "fridge" })
  public products: Collection<Product>;
}
