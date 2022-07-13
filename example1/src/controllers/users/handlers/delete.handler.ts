import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entities/user.entity";

export const deleteUser = async (idString: string) => {
  const em = RequestContext.getEntityManager();
  const user = await em.findOneOrFail(User, { id: idString });

  await em.removeAndFlush(user);
};
