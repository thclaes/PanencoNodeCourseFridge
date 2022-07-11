import { UserStore } from "./user.store"

export const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    const user = UserStore.get(id);
    
    if (!user) {
        return next({ error: 'User not found' });
    }
    UserStore.delete(id);
    res.status(204);
}