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
import { getAllProductsFromFridge } from "./handlers/getFridge.handler";
import { getAllProductsFromAllFridges } from "./handlers/getAllFridge.handler";
import { ProductBody } from "../../contracts/product.body";
import { FridgeBody } from "../../contracts/fridge.body";
import { createFridge } from "./handlers/createFridge.handler";

@JsonController("/fridge")
export class FridgeController {
  @Get()
  @Authorized()
  @ListRepresenter(ProductBody)
  async getAllProductsFromAllFridges(@Query() query: SearchQuery) {
    return getAllProductsFromAllFridges(query.search); //query.search == location
  }

  @Get("/:id")
  @Authorized()
  @ListRepresenter(ProductBody)
  async getAllProductsFromFridge(@Param("id") id: string) {
    return getAllProductsFromFridge(id);
  }

  @Post()
  @Representer(FridgeBody, StatusCode.created)
  async createFridge(@Body() body: FridgeBody) {
    return createFridge(body);
  }
}
