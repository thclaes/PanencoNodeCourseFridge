import { NextFunction, Request, Response } from "express";
import { UserStore } from "./user.store"

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const user = UserStore.get(id);

    user ? res.json(user) : res.status(404).json({
        error: 'user not found',
      });
}