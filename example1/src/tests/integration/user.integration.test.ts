import { expect } from "chai";
import supertest from "supertest";
import { App } from "../../app";
import { UserBody } from "../../contracts/user.body";
import { User, UserStore } from "../../controllers/users/handlers/user.store";


describe('Integration tests', () => {
    describe('User Tests', async () => {
      let request: supertest.SuperTest<supertest.Test>;
      beforeEach(() => {
        const app = new App();
        request = supertest(app.host);
      });

      it('crud', async () => {
        const body : UserBody = {
            name: 'test',
            email: 'test-user+1@panenco.com',
            password: 'real secret stuff',
        };
        const updateUser = {
            email: 'new-mail+1@panenco.com',
        } as UserBody;

        const { body: unAuthResponse } = await request
            .post(`/api/users`)
            .send(body)
            .expect(401);

        const ogDBLength = UserStore.users.length;

        const { body: createSuccessResponse } = await request
            .post(`/api/users`)
            .send(body)
            .set('x-auth', 'Supersecure')
            .expect(201);

        expect(ogDBLength+1).equals(UserStore.users.length);
        expect(UserStore.users.filter((x) => (x.id == createSuccessResponse.id)).length).equal(1);
        expect(UserStore.users.find((x) => (x.id == createSuccessResponse.id)).name).equals(body.name);

        const { body: validUpdate } = await request
            .patch(`/api/users/`+createSuccessResponse.id)
            .send(updateUser)
            .expect(200);

        expect(UserStore.users.find((x) => (x.id == createSuccessResponse.id)).email).equals(updateUser.email);
        expect(validUpdate.password).equals(undefined);

        const { body: getUpdatedUser } = await request
            .get(`/api/users/`+createSuccessResponse.id)
            .expect(200);

        expect(getUpdatedUser.name).equals(body.name);
        expect(getUpdatedUser.email).equals(updateUser.email);
        expect(getUpdatedUser.password).equals(body.password);
        
        const { body: deleteUser } = await request
        .delete(`/api/users/`+createSuccessResponse.id)
        .expect(204);
        
        
        const { body: allUsers } = await request
            .get(`/api/users/`)
            .expect(200);

        expect(allUsers.filter((x) => (x.id == createSuccessResponse.id)).length).equal(0);
      });
    });
  });