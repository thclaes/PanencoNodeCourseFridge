import { Authorized, Get, JsonController, Param } from "routing-controllers";
import {
  ListRepresenter,
  Query,
} from "@panenco/papi";
import { SearchQuery } from "../../contracts/search.query";
import "express-async-errors";
import { getAllProductsFromFridge } from "./handlers/getFridge.handler";
import { getAllProductsFromAllFridges } from "./handlers/getAllFridge.handler";
import { ProductBody } from "../../contracts/product.body";

@JsonController("/fridge")
export class FridgeController {
  @Get()
  //@Authorized()
  @ListRepresenter(ProductBody)
  async getAllProductsFromAllFridges(@Query() query: SearchQuery) {
    return getAllProductsFromAllFridges(query.search); //query.search == location
  }

  @Get("/:id")
  //@Authorized()
  @ListRepresenter(ProductBody)
  async getAllProductsFromFridge(@Param("id") id: string) {
    return getAllProductsFromFridge(id);
  }
}
