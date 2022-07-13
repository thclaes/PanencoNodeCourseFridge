import { RequestContext } from '@mikro-orm/core';
import { createAccessToken, Unauthorized } from '@panenco/papi';

import { LoginBody } from '../../../contracts/login.body';
import { User } from '../../../entities/user.entity';
import { UserStore } from '../../users/handlers/user.store';

export const login = async (body: LoginBody) => {
  const em = RequestContext.getEntityManager();
  const user = await em.findOneOrFail(User, { email: body.email });

  const result = await createAccessToken('jwtSecretFromConfigHere', 60 * 10, { userId: user.id });
  return result;
};