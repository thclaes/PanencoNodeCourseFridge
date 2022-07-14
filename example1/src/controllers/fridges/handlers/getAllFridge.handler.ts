import { RequestContext } from "@mikro-orm/core";
import { Fridge } from "../../../entities/fridge.entity";
import { Product } from "../../../entities/product.entity";

export const getAllProductsFromAllFridges = async (
  search: string = undefined
): Promise<[Product[], number]> => {
  const em = RequestContext.getEntityManager();
  const fridges: Fridge[] = await em.find(
    Fridge,
    search? { location: { $ilike: `%${search}%`} }: {},
    { populate: ['products'] }
  );
  const allProducts: Product[] = [];
  fridges.forEach((fridge) => {
    allProducts.push(...Array.from(fridge.products));
  });
  return [allProducts, allProducts.length];
};
