import { Collection } from '@mikro-orm/core';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { Product } from '../entities/product.entity';

@Exclude()
export class FridgeView {
  @Expose()
  @IsString()
  public id: string;

  @Expose()
  @IsString()
  public location: string;

  @Expose()
  @IsNumber()
  public capacity: number;
  
  @Expose()
  @Type(() => Product)
  public products: Collection<Product>;
}