import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entities/user.entity";

export const get = async (id: string): Promise<User> => {
  const em = RequestContext.getEntityManager();
  const user = await em.findOneOrFail(User, { id });

  return user;
};
