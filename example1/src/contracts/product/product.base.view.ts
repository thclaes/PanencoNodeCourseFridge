import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

@Exclude()
export class ProductBaseView {
  @Expose()
  @IsNumber()
  public id: string;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public type: string;

  @Expose()
  @IsNumber()
  public size?: number;
}