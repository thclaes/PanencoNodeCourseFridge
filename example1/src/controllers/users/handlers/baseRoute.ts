import { Router } from 'express';

export abstract class baseRoute {
    router!: Router;
    path!: String;

    constructor(){}
}
