import { getList } from "./handlers/getList.handler";
import { create } from "./handlers/create.handler";
import { get } from "./handlers/get.handler";
import { update } from "./handlers/update.handler";
import { deleteUser } from "./handlers/delete.handler";
import { UserBody } from "../../contracts/user.body";
import { UserView } from "../../contracts/user.view";
import {
  Authorized,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
} from "routing-controllers";
import {
  Body,
  ListRepresenter,
  Query,
  Representer,
  StatusCode,
} from "@panenco/papi";
import { SearchQuery } from "../../contracts/search.query";
import "express-async-errors";
import { OpenAPI } from "routing-controllers-openapi";

@JsonController("/users")
export class UserController {
  // this.router.post('/', adminMiddleware, create);
  //   this.router.patch('/:id', update);

  @Post()
  @Representer(UserView, StatusCode.created)
  @OpenAPI({ summary: "Create a new user" })
  async create(@Body() body: UserBody) {
    return create(body);
  }

  @Get()
  @Authorized()
  @ListRepresenter(UserView)
  async getList(@Query() query: SearchQuery) {
    return getList(query.search);
  }

  @Get("/:id")
  @Authorized()
  @Representer(UserView)
  async get(@Param("id") id: string) {
    return get(id);
  }

  @Patch("/:id")
  @Authorized()
  @Representer(UserView)
  async update(
    @Param("id") id: string,
    @Body({}, { skipMissingProperties: true }) body: UserBody
  ) {
    return update(id, body);
  }

  @Delete("/:id")
  @Authorized()
  @Representer(null)
  async delete(@Param("id") id: string) {
    return deleteUser(id);
  }
}
