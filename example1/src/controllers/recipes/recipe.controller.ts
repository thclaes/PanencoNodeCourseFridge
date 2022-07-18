import {
  Authorized,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  Req,
} from "routing-controllers";
import { Body, ListRepresenter, Representer, StatusCode } from "@panenco/papi";
import "express-async-errors";
import { OpenAPI } from "routing-controllers-openapi";
import { RecipeView } from "../../contracts/recipe/recipe.view";
import { RecipeBody } from "../../contracts/recipe/recipe.body";
import { create } from "./handlers/createRecipe.handler";
import { get } from "./handlers/getRecipe.handler";
import { getList } from "./handlers/getListRecipe.handler";
import { update } from "./handlers/updateRecipe.handler";
import { deleteRecipe } from "./handlers/deleteRecipe.handler";
import { getMissingIngredients } from "./handlers/getMissing.handler";
import { ProductView } from "../../contracts/product/product.view";
import { Request } from "express";

@JsonController("/recipes")
export class RecipeController {
  @Post()
  @Representer(RecipeView, StatusCode.created)
  @OpenAPI({ summary: "Create a new recipe" })
  async create(@Body() body: RecipeBody, @Req() req: Request) {
    const {
      token: { userId },
    } = req;
    return create(body, userId);
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

  @Get("/:id/missingIngredients")
  @Authorized()
  @ListRepresenter(ProductView)
  async getMissingIngredients(@Param("id") recipeId: string, @Req() req: any) {
    const {
      token: { userId },
    } = req;
    return getMissingIngredients(userId, recipeId);
  }

  @Patch("/:id")
  // @Authorized()
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
