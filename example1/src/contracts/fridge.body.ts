import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

@Exclude()
export class FridgeBody {
  @Expose()
  @IsString()
  public location: string;

  @Expose()
  @IsNumber()
  public capacity: number;
}