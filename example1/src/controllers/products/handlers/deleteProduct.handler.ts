import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity";
import { User } from "../../../entities/user.entity";

export const deleteProduct = async (idString: string) => {
  const em = RequestContext.getEntityManager();
  const product = await em.findOneOrFail(
    Product,
    { id: idString },
    { populate: ["fridge", "owner", "productRecipes"] }
  );

  await em.removeAndFlush(product);
};
