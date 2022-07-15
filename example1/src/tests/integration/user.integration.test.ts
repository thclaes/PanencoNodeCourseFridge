import { MikroORM, RequestContext } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { expect } from "chai";
import supertest from "supertest";
import { App } from "../../app";
import { LoginBody } from "../../contracts/login.body";
import { UserBody } from "../../contracts/user.body";
import { User } from "../../entities/user.entity";

describe("Integration tests", () => {
  describe("User Tests", async () => {
    let request: supertest.SuperTest<supertest.Test>;
    let orm: MikroORM<PostgreSqlDriver>;

    before(async () => {
      const app = new App();
      await app.createConnection();
      orm = app.orm;
      request = supertest(app.host);
    });

    beforeEach(async () => {
      await orm.em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
      await orm.getMigrator().up();
    });

    it("crud", async () => {
      await RequestContext.createAsync(orm.em.fork(), async () => {
        const body: UserBody = {
          name: "test",
          email: "test-user+1@panenco.com",
          password: "real secret stuff",
        };
        const login: LoginBody = {
          email: "test-user+1@panenco.com",
          password: "real secret stuff",
        };
        const updateUser = {
          email: "new-mail+1@panenco.com",
        } as UserBody;

        const ogDBLength = (await orm.em.find(User, {})).length;

        const { body: createSuccessResponse } = await request
          .post(`/api/users`)
          .send(body)
          .expect(201);

        expect(ogDBLength + 1).equals((await orm.em.find(User, {})).length);
        expect(
          (await orm.em.findOne(User, { id: createSuccessResponse.id })).name
        ).equals(body.name);

        const { body: auth } = await request
          .post("/api/auth/tokens")
          .send(login)
          .expect(200);

        const re = await request
          .patch(`/api/users/${createSuccessResponse.id}`)
          .send(updateUser)
          .set("x-auth", auth.token)
          .expect(200);
        const { body: validUpdate } = re;
        orm.em.clear();
        expect(
          (await orm.em.findOne(User, { id: createSuccessResponse.id })).email
        ).equals(updateUser.email);
        expect(validUpdate.password).equals(undefined);

        const { body: getUpdatedUser } = await request
          .get(`/api/users/${createSuccessResponse.id}`)
          .set("x-auth", auth.token)
          .expect(200);

        expect(getUpdatedUser.name).equals(body.name);
        expect(getUpdatedUser.email).equals(updateUser.email);
        expect(getUpdatedUser.password).equals(undefined);

        await request
          .delete(`/api/users/${createSuccessResponse.id}`)
          .set("x-auth", auth.token)
          .expect(204);

        const { body: getNoneResponse } = await request
          .get(`/api/users/`)
          .set("x-auth", auth.token)
          .expect(200);
        const { count: getNoneCount } = getNoneResponse;
        expect(getNoneCount).equal(0);
      });
    });
  });
});
