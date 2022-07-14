import { RequestContext } from "@mikro-orm/core";
import { Product } from "../../../entities/product.entity";

export const getProduct = async (id: string): Promise<Product> => {
    const em = RequestContext.getEntityManager();
    return await em.findOneOrFail(Product,{ id }, { populate: ['owner', 'fridge'] });
};