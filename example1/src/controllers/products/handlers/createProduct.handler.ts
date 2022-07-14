import { RequestContext } from "@mikro-orm/core";
import { ProductBody } from "../../../contracts/product/product.body";
import { Fridge } from "../../../entities/fridge.entity";
import { Product } from "../../../entities/product.entity";
import { User } from "../../../entities/user.entity";

export const createProduct = async (body: ProductBody): Promise<Product> => {
  const em = RequestContext.getEntityManager();

  const {userId, fridgeId, ...newBody} = body;
  const product = em.create(Product, newBody);
  product.owner = em.getReference(User, userId);
  product.fridge = em.getReference(Fridge, fridgeId);

  await em.persistAndFlush(product);

  return product;
};