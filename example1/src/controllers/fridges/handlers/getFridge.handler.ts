import { RequestContext } from "@mikro-orm/core";
import { Fridge } from "../../../entities/fridge.entity";
import { Product } from "../../../entities/product.entity";

export const getAllProductsFromFridge = async (id: string): Promise<Product[]> => {
    const em = RequestContext.getEntityManager();
    const fridge: Fridge = await em.findOneOrFail(Fridge,{ id }, { populate: true });
    let allProducts: Product[];
    allProducts.push(...Array.from(fridge.products));
    return allProducts;
};