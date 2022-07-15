import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

@Exclude()
export class ProductAmount {
  @Expose()
  @IsString()
  public product_id: string;
  @Expose()
  @IsNumber()
  public amount: number;
}
