import { RequestContext } from "@mikro-orm/core";
import { NotFound } from "@panenco/papi";
import { NextFunction, Request, Response } from "express";
import { User } from "../../../entities/user.entity";
import { UserStore } from "./user.store"

export const deleteUser = async (idString:string) => {
    const em = RequestContext.getEntityManager();
    const user = await em.findOneOrFail(User, {  id:idString })

    await em.removeAndFlush(user);
}