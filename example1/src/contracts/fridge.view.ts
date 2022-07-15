import { Collection } from '@mikro-orm/core';
import { Exclude, Expose, Type } from 'class-transformer';
import { FridgeBaseView } from './fridge.base.view';
import { ProductBaseView } from './product/product.base.view';

@Exclude()
export class FridgeView extends FridgeBaseView{
  @Expose()
  @Type(() => ProductBaseView)
  public products: Collection<ProductBaseView>;
}