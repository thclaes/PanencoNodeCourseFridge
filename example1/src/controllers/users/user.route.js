import { Router } from 'express';
import { getList } from './handlers/getList.handler';
import { create } from './handlers/create.handler';
import { get } from './handlers/get.handler';
import { update } from './handlers/update.handler';
import { deleteUser } from './handlers/delete.handler';

export class UserRoute {
    constructor() {
      const adminMiddleware = (req, res, next) => {
        if(req.header("x-auth") !== "Supersecure"){
            return res.status(401).send("Unauthorized");
        }
        next();
      };
      this.router = Router();


      this.path = 'users';
  
      this.router.get('/', getList);
      this.router.post('/', adminMiddleware, create);
      this.router.get('/:id', get);
      this.router.patch('/:id', update);
      this.router.delete('/:id', deleteUser);

    }
}