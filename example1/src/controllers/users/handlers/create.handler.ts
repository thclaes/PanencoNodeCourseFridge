import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { UserBody } from "../../../contracts/user.body";
import { UserView } from "../../../contracts/user.view";
import { UserStore } from "./user.store"

export const create = async (req: Request, res: Response, next: NextFunction) => {
  // transform the plain object to an instance of our UserBody class using the plainToInstance function from the class-transformer package
  const transformed = plainToInstance(UserBody, req.body);
  // now validate the transformed object and retrieve possible errors
  const validationErrors = await validate(transformed, {
    skipMissingProperties: false,
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  // if errors were found pass them to the express NextFunction and express will skip any remaining non-error handling middleware and output these errors as the response.
  if (validationErrors.length) {
    return next(validationErrors);
  }
  const user = UserStore.add(transformed);
  res.json(plainToInstance(UserView, user));
}