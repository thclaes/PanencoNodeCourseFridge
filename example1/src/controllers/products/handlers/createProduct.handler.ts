import { RequestContext } from "@mikro-orm/core";
import { Conflict, NotFound } from "@panenco/papi";
import { ProductBody } from "../../../contracts/product/product.body";
import { Product } from "../../../entities/product.entity";
import { getFridge } from "../../fridges/handlers/getFridge.handler";
import { get } from "../../users/handlers/getUser.handler";

export const createProduct = async (body: ProductBody, userId: string): Promise<Product> => {
  const em = RequestContext.getEntityManager();
  
  const {fridgeId, ...bodyWithoutFK} = body;

  const fridge = await getFridge(fridgeId);
  const products = Array.from(fridge.products);
  let totalContent = 0;
  products.forEach(product => {
    totalContent += product.size;
  });
  if (totalContent + bodyWithoutFK.size > fridge.capacity) throw new Conflict("fridge full", "fridge full");

  const product = em.create(Product, bodyWithoutFK);
  product.owner = await get(userId);
  product.fridge = fridge;

  await em.persistAndFlush(product);

  return product;
};