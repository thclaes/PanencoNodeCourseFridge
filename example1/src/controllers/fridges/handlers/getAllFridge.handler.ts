import { RequestContext } from "@mikro-orm/core";
import { Fridge } from "../../../entities/fridge.entity";
import { Product } from "../../../entities/product.entity";

export const getAllProductsFromAllFridges = async (
  search: string
): Promise<Product[]> => {
  const em = RequestContext.getEntityManager();
  const fridges: Fridge[] = await em.find(
    Fridge,
    { location: search },
    { populate: true }
  );
  let allProducts: Product[];
  fridges.forEach((fridge) => {
    allProducts.push(...Array.from(fridge.products));
  });
  return allProducts;
};
