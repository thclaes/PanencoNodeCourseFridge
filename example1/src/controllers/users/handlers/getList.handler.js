import { UserStore } from "./user.store"

export const getList = async (req, res, next) => {
    const search = req.query.search;

    const users = UserStore.find(search);
    res.json(users);
}