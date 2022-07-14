import { RequestContext } from "@mikro-orm/core";
import { Recipe } from "../../../entities/recipe.entity";

export const getList = async (): Promise<[Recipe[], number]> => {
  const em = RequestContext.getEntityManager();

  const [recipes, length]: [Recipe[], number] = await em.findAndCount(
    Recipe,
    {}
  );

  return [recipes, length];
};
