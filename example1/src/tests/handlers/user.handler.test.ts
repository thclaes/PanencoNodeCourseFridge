import { expect } from "chai";
import { getList } from "../../controllers/users/handlers/getList.handler";
import { User, UserStore } from "../../controllers/users/handlers/user.store";
import { NextFunction, Request, Response } from "express";
import { count } from "console";
import { get } from "../../controllers/users/handlers/get.handler";

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
            { params: { id: 'xxx' } as any } as Request,
            { json: (val) => (res = val) } as Response,
            null as NextFunction
        );

        expect(res.error).equal('user not found');
      });
    });
  });