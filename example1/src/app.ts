import { Application, NextFunction, Request, Response } from "express";
import express from 'express';
import { Express } from 'express';
import { UserRoute } from './controllers/users/user.route';

export class App {
  host: Application;
  constructor() {
    // Init server
    this.host = express();
    this.host.use(express.json());
    this.host.use((req: Request, res: Response, next: NextFunction) => {
      console.log(req.method, req.url);
      next();
    });
    const usersRoute = new UserRoute();

    this.host.get('/', (req: Request, res: Response, next: NextFunction) => {
        res.send('Hello World!');
    });
    this.host.use(`/api/${usersRoute.path}`, usersRoute.router);
    this.host.use((error:string , req: Request, res: Response, next: NextFunction) => {
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