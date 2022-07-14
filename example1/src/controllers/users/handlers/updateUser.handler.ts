import { RequestContext } from "@mikro-orm/core";
import { UserBody } from "../../../contracts/user.body";
import { User } from "../../../entities/user.entity";

export const update = async (idString: string, body: UserBody) => {
  const em = RequestContext.getEntityManager();

  const user = await em.findOneOrFail(User, { id: idString });

  const res = user.assign(body);
  await em.flush();
  return res;
};
