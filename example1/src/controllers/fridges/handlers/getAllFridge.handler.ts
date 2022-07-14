import { RequestContext } from "@mikro-orm/core";
import { Fridge } from "../../../entities/fridge.entity";
import { Product } from "../../../entities/product.entity";

export const getAllFridges = async (search: string = undefined): Promise<[Fridge[], number]> => {
  const em = RequestContext.getEntityManager();
  const fridges: Fridge[] = await em.find(
    Fridge,
    search? { location: { $ilike: `%${search}%`} }: {},
    { populate: ['products'] }
  );
  return [fridges, fridges.length];
};
