import { Authorized, Delete, Get, JsonController, Param, Post } from "routing-controllers";
import {
    Body,
  ListRepresenter,
  Query,
  Representer,
  StatusCode,
} from "@panenco/papi";
import { SearchQuery } from "../../contracts/search.query";
import "express-async-errors";
import { ProductBody } from "../../contracts/product/product.body";
import { getProduct } from "./handlers/getProduct.handler";
import { createProduct } from "./handlers/createProduct.handler";
import { ProductView } from "../../contracts/product/product.view";
import { deleteProduct } from "./handlers/deleteProduct.handler";

@JsonController("/product")
export class ProductController {
  @Get("/:id")
  @Authorized()
  @Representer(ProductView)
  async getProduct(@Param("id") id: string) {
    return getProduct(id);
  }

  @Post()
  @Authorized()
  @Representer(ProductView, StatusCode.created)
  async createProduct(@Body() body: ProductBody) {
    return createProduct(body);
  }

  @Delete("/:id")
  @Authorized()
  @Representer(null)
  async deleteProduct(@Param("id") id: string) {
    return deleteProduct(id);
  }
}