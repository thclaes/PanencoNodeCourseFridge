import { UserStore } from "./user.store"

export const get = async (req, res, next) => {
    const id = req.params.id;
    const user = UserStore.get(id);

    user ? res.json(user) : res.status(404).json({
        error: 'user not found',
      });
}