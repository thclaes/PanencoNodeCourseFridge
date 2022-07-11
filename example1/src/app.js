import express from 'express';
import { UserRoute } from './controllers/users/user.route';

export class App {
  constructor() {
    // Init server
    this.host = express();
    this.host.use(express.json());
    this.host.use((req, res, next) => {
      console.log(req.method, req.url);
      next();
    });
    const usersRoute = new UserRoute();

    this.host.get('/', (req, res, next) => {
        res.send('Hello World!');
    });
    this.host.use(`/api/${usersRoute.path}`, usersRoute.router);
    this.host.use((error, req, res, next) => {
      res.status(400).json(error);
    });
    this.host.use((req, res, next) => {
      res.status(404).send('No Endpoint found');
    });
  }

  listen() {
    this.host.listen(3000, () => {
      console.info(`🚀 http://localhost:3000`);
      console.info(`========================`);
    });
  }
}