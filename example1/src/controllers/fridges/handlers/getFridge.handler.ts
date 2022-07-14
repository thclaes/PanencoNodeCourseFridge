import { RequestContext } from "@mikro-orm/core";
import { Fridge } from "../../../entities/fridge.entity";
import { Product } from "../../../entities/product.entity";

export const getFridge = async (id: string): Promise<Fridge> => {
    const em = RequestContext.getEntityManager();
    return await em.findOneOrFail(Fridge,{ id }, { populate: ['products'] });
};