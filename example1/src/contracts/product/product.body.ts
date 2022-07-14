import { Exclude, Expose, Transform } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { TypeEnum } from "../../Enums/typeEnum";

@Exclude()
export class ProductBody {
  @Expose()
  @IsString()
  @Transform(({ type }) => TypeEnum[type])
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

  @Expose()
  @IsString()
  public userId: string;
}
