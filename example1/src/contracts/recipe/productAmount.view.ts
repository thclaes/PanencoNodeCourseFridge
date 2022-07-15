import { Exclude, Expose, Type } from "class-transformer";
import { IsNumber } from "class-validator";
import { ProductBaseView } from "../product/product.base.view";

@Exclude()
export class ProductAmountView {
  @Expose()
  @Type(()=>ProductBaseView)
  public product: ProductBaseView;

  @Expose()
  @IsNumber()
  public amount: number;
}
