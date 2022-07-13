import { Application, NextFunction, Request, Response } from "express";
import express from 'express';
import { Express } from 'express';
import { UserController } from './controllers/users/user.controller';
import { getMetadataArgsStorage, RoutingControllersOptions, useExpressServer } from "routing-controllers";
import { errorMiddleware, getAuthenticator } from "@panenco/papi";
import { AuthController } from "./controllers/auth/auth.controller";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { routingControllersToSpec } from "routing-controllers-openapi";
import swaggerUi from 'swagger-ui-express';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import ormConfig from './orm.config';
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

export class App {
  public orm: MikroORM<PostgreSqlDriver>;
  host: Application;
  constructor() {
    // Init server
    this.host = express();
    this.host.use(express.json());
    this.initializeControllers([AuthController, UserController]);
    this.initializeSwagger();

    this.host.get('/', (req: Request, res: Response) => {
        res.send('Hello World!');
    });

    this.host.use(errorMiddleware);
    this.host.use((req, __, next: NextFunction) => {
      RequestContext.create(this.orm.em, next);
    });
    
  }

  listen() {
    this.host.listen(3000, () => {
      console.info(`🚀 http://localhost:3000`);
      console.info(`========================`);
    });
  }

  private initializeControllers(controllers: Function[]) {
    useExpressServer(this.host, {
      cors: {
        origin: '*',
        credentials: true,
        exposedHeaders: ['x-auth'],
      },
      controllers,
      defaultErrorHandler: false,
      routePrefix: '/api',
      authorizationChecker: getAuthenticator('jwtSecretFromConfigHere'),
    });
  }


  private initializeSwagger() {
    const { defaultMetadataStorage } = require('class-transformer/cjs/storage');

    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    }); // convert the metadata to an OpenAPI json schema

    const routingControllersOptions: RoutingControllersOptions = {
      routePrefix: '/api', // Set the route prefix so swagger knows all endpoints are prefixed with /api
    }; // configure some general options

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, { // Convert the routing controller metadata + the class-validator metadata into an OpenAPI spec
      components: {
        schemas,
        securitySchemes: { // Add a security scheme so we will be able to enter a token on the endpoints
          JWT: {
            in: 'header',
            name: 'x-auth', // Define the header key to use
            type: 'apiKey',
            bearerFormat: 'JWT',
            description: 'JWT Authorization header using the JWT scheme. Example: "x-auth: {token}"',
          },
        },
      },
      security: [{ JWT: [] }],
    });

    this.host.use('/docs', swaggerUi.serve, swaggerUi.setup(spec)); // Host swagger ui on /docs
  }

  public async createConnection() {
    try {
      this.orm = await MikroORM.init(ormConfig);
    } catch (error) {
      console.log('Error while connecting to the database', error);
    }
  }
}