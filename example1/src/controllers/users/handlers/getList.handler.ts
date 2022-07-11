import { NextFunction, Request, Response } from "express";
import { UserStore } from "./user.store"

export const getList = async (req: Request, res: Response, next: NextFunction) => {
    const search = req.query.search;

    const users = search ? UserStore.find(String(search)) : UserStore.find();
    res.json(users);
}