import { UserStore } from "./user.store"

export const create = async (req, res, next) => {
    if (!req.body.name) {
        return next({
          error: 'name is required',
        });
      }
    res.json(UserStore.add(req.body));
}