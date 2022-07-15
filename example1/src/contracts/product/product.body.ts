import { Exclude, Expose } from "class-transformer";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { TypeEnum } from "../../Enums/typeEnum";

@Exclude()
export class ProductBody {
  @Expose()
  @IsEnum(TypeEnum)
  public type: TypeEnum;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsNumber()
  public size: number;

  @Expose()
  @IsString()
  public fridgeId: string;
}
