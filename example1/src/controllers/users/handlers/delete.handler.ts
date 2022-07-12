import { NextFunction, Request, Response } from "express";
import { UserStore } from "./user.store"

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    const user = UserStore.get(id);
    
    if (!user) {
        return next({ error: 'User not found' });
    }
    UserStore.delete(id);
    res.status(204).end();
}