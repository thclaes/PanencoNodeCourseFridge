import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity";

export const deleteProduct = async (id: string) => {
  const em = RequestContext.getEntityManager();
  const product = await em.findOneOrFail(
    Product,
    { id },
    { populate: ["fridge", "owner", "productRecipes"] }
  );

  await em.removeAndFlush(product);
};
