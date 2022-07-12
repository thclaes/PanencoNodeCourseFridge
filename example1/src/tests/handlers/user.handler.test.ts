import { expect } from "chai";
import { getList } from "../../controllers/users/handlers/getList.handler";
import { User, UserStore } from "../../controllers/users/handlers/user.store";
import { NextFunction, Request, Response } from "express";
import { count } from "console";
import { get } from "../../controllers/users/handlers/get.handler";
import { create } from "../../controllers/users/handlers/create.handler";
import { UserBody } from "../../contracts/user.body";
import { UserView } from "../../contracts/user.view";
import { update } from "../../controllers/users/handlers/update.handler";
import { deleteUser } from "../../controllers/users/handlers/delete.handler";

const userFixtures: User[] = [
    {
      name: 'test1',
      email: 'test-user+1@panenco.com',
      id: 0,
      password: 'password1',
    },
    {
      name: 'test2',
      email: 'test-user+2@panenco.com',
      id: 1,
      password: 'password2',
    },
  ];

describe('Handler tests', () => {
    describe('User Tests', () => {
      beforeEach(() => {
        UserStore.users = [...userFixtures]; // Clone the array
      });
      
      it('should get users', () => {
        let res: User[];
        getList(
            { query: {} } as Request,
            { json: (val) => (res = val) } as Response,
            null as NextFunction
        );

        expect(res.some((x) => x.name === 'test1')).true;
      });

      it('should search users', () => {
        let res: User[];
        getList(
          { query: { search: 'test1' } as any } as Request,
          { json: (val) => (res = val) } as Response,
          null as NextFunction
        );
      
        expect(res.some((x) => x.name === 'test1')).true;
      });

      it('should get user by id', () => {
        let res: User;

        get(
            { params: { id: '1' } as any } as Request,
            { json: (val) => (res = val) } as Response,
            null as NextFunction
        );

        expect(res == userFixtures[1]).true;
      });

      it('should fail when getting user by unknown id', () => {
        let res: any;

        get(
            { params: { id: '55' } as any } as Request,
            { status: (s) => ({ json: (val) => (res = val) }) } as Response,
            null as NextFunction
        );

        expect(res.error).equal('user not found');
      });

      it('should create user', async () => {
        let res: User;
        const newUser: UserBody = {
          name: 'Jef',
          email: 'jef@hotmail.com',
          password: 'PasswordJef'
        };

        await create(
          { body: newUser } as Request,
          { status: (s) => ({ json: (val) => (res = val) }) } as Response,
          null as NextFunction
        );

        expect(res.name).equals(newUser.name);
        expect(res.email).equals(newUser.email);
        expect(UserStore.users.filter((x) => (x.name == newUser.name)).length).equal(1);
        expect(res.password).equals(undefined);
      });

      it('should update user', () => {
        let res = {locals: {}} as Response;
        const body = {
          name: 'Jos',
          password: 'PasswordJos'
        } as UserBody;
        const id = 1;

        update(
          { body, params: { id } as any } as Request,
          res,
          null as NextFunction
        );

        expect(res.locals.body.name).equals(body.name);
        expect(res.locals.body.password).equals(body.password);
        expect(UserStore.users.filter((x) => (x.name == body.name)).length).equal(1);
        expect(UserStore.users.find((x) => (x.id == id)).email).equal('test-user+2@panenco.com');
      });

      it('should delete user', async () => {
        let status : number;
        const id = 1;

        await deleteUser(
          { params: { id } as any } as Request,
          {
            status: (s) => {
              status = s;
              return { end: () => null };
            },
          } as Response,
          null as NextFunction
        );

        expect(UserStore.users.filter((x) => (x.id == id)).length).equal(0);
        expect(status).equals(204);
      });
    });
  });