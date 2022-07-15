import { Authorized, Get, JsonController, Param, Post } from "routing-controllers";
import {
    Body,
  ListRepresenter,
  Query,
  Representer,
  StatusCode,
} from "@panenco/papi";
import { SearchQuery } from "../../contracts/search.query";
import "express-async-errors";
import { getFridge } from "./handlers/getFridge.handler";
import { getAllFridges } from "./handlers/getAllFridge.handler";
import { FridgeBody } from "../../contracts/fridge.body";
import { createFridge } from "./handlers/createFridge.handler";
import { FridgeView } from "../../contracts/fridge.view";

@JsonController("/fridge")
export class FridgeController {
  @Get()
  @Authorized()
  @ListRepresenter(FridgeView)
  async getAllFridges(@Query() query: SearchQuery) {
    return getAllFridges(query.search); //query.search == location
  }

  @Get("/:id")
  @Authorized()
  @Representer(FridgeView)
  async getFridge(@Param("id") id: string) {
    return getFridge(id);
  }

  @Post()
  @Representer(FridgeView, StatusCode.created)
  async createFridge(@Body() body: FridgeBody) {
    return createFridge(body);
  }
}
