import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

@Exclude()
export class FridgeBaseView {
  @Expose()
  @IsString()
  public id: string;

  @Expose()
  @IsString()
  public location: string;

  @Expose()
  @IsNumber()
  public capacity: number;
}