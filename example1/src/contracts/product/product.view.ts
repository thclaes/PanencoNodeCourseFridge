import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import { Fridge } from '../../entities/fridge.entity';
import { User } from '../../entities/user.entity';

@Exclude()
export class ProductView {
  @Expose()
  @IsNumber()
  public id: number;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public type: string;

  @Expose()
  @IsNumber()
  public size: number;

  @Expose()
  public owner: User;

  @Expose()
  public fridge: Fridge;
}