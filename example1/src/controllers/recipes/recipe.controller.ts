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
import { RecipeView } from "../../contracts/recipe/recipe.view";
import { RecipeBody } from "../../contracts/recipe/recipe.body";
import { create } from "./handlers/createRecipe.handler";

@JsonController("/recipes")
export class RecipeController {
  @Post()
  @Representer(RecipeView, StatusCode.created)
  @OpenAPI({ summary: "Create a new recipe" })
  async create(@Body() body: RecipeBody) {
    return create(body);
  }

  //   @Get()
  //   @Authorized()
  //   @ListRepresenter(UserView)
  //   async getList(@Query() query: SearchQuery) {
  //     return getList(query.search);
  //   }

  //   @Get("/:id")
  //   @Authorized()
  //   @Representer(UserView)
  //   async get(@Param("id") id: string) {
  //     return get(id);
  //   }

  //   @Patch("/:id")
  //   @Authorized()
  //   @Representer(UserView)
  //   async update(
  //     @Param("id") id: string,
  //     @Body({}, { skipMissingProperties: true }) body: UserBody
  //   ) {
  //     return update(id, body);
  //   }

  //   @Delete("/:id")
  //   @Authorized()
  //   @Representer(null)
  //   async delete(@Param("id") id: string) {
  //     return deleteUser(id);
  //   }
}
