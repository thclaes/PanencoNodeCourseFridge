import { UserStore } from "./user.store"

export const deleteUser = async (req, res, next) => {
    // const id = req.params.id;

    // const users = UserStore.delete(id);
    // res.json(users);

    const user = UserStore.get(req.params.id);
    // Duplicated in multiple places for now. This will be refactored later.
    if (!user) {
        return next({ error: 'User not found' });
    }
    res.status(204);
}