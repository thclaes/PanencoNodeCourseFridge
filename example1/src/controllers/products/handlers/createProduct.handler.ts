import { RequestContext } from "@mikro-orm/core";
import { ProductBody } from "../../../contracts/product/product.body";
import { Product } from "../../../entities/product.entity";
import { getFridge } from "../../fridges/handlers/getFridge.handler";
import { get } from "../../users/handlers/getUser.handler";

export const createProduct = async (body: ProductBody): Promise<Product> => {
  const em = RequestContext.getEntityManager();

  const {userId, fridgeId, ...bodyWithoutFK} = body;
  const product = em.create(Product, bodyWithoutFK);
  product.owner = await get(userId);
  product.fridge = await getFridge(fridgeId);

  await em.persistAndFlush(product);

  return product;
};