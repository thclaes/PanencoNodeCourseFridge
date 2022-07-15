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
  Representer,
  StatusCode,
} from "@panenco/papi";
import "express-async-errors";
import { OpenAPI } from "routing-controllers-openapi";
import { RecipeView } from "../../contracts/recipe/recipe.view";
import { RecipeBody } from "../../contracts/recipe/recipe.body";
import { create } from "./handlers/createRecipe.handler";
import { get } from "./handlers/getRecipe.handler";
import { getList } from "./handlers/getListRecipe.handler";
import { update } from "./handlers/updateRecipe.handler";
import { deleteRecipe } from "./handlers/deleteRecipe.handler";

@JsonController("/recipes")
export class RecipeController {
  @Post()
  @Representer(RecipeView, StatusCode.created)
  @OpenAPI({ summary: "Create a new recipe" })
  async create(@Body() body: RecipeBody) {
    return create(body);
  }

  @Get()
  @Authorized()
  @ListRepresenter(RecipeView)
  async getList() {
    return getList();
  }

  @Get("/:id")
  @Authorized()
  @Representer(RecipeView)
  async get(@Param("id") id: string) {
    return get(id);
  }

  @Patch("/:id")
  @Authorized()
  @Representer(RecipeView)
  async update(
    @Param("id") id: string,
    @Body({}, { skipMissingProperties: true }) body: RecipeBody
  ) {
    return update(id, body);
  }

  @Delete("/:id")
  @Authorized()
  @Representer(null)
  async delete(@Param("id") id: string) {
    return deleteRecipe(id);
  }
}
