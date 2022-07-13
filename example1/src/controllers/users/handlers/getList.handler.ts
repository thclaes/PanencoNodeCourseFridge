import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entities/user.entity";

export const getList = async (search?: string) : Promise<[User[], number]> => {
    const em = RequestContext.getEntityManager();

    const [users, length] : [User[], number] = await em.findAndCount(User, 
        search?{
            $or:[
                { email: { $ilike: `%${search}%`} },
                { name: { $ilike: `%${search}%`} }
            ]
        } : {}
        );

    return [users, length]
}