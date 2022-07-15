import { Exclude, Expose, Type } from 'class-transformer';
import { FridgeBaseView } from '../fridge.base.view';
import { UserView } from "../user.view";
import { ProductBaseView } from './product.base.view';

@Exclude()
export class ProductView extends ProductBaseView{
  @Expose()
  @Type(() => UserView)
  public owner: UserView;

  @Expose()
  @Type(() => FridgeBaseView)
  public fridge: FridgeBaseView;
}