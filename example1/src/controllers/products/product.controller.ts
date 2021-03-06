import {
  Authorized,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Req,
} from "routing-controllers";
import { Body, Representer, StatusCode } from "@panenco/papi";
import "express-async-errors";
import { ProductBody } from "../../contracts/product/product.body";
import { getProduct } from "./handlers/getProduct.handler";
import { ProductView } from "../../contracts/product/product.view";
import { deleteProduct } from "./handlers/deleteProduct.handler";
import { createProduct } from "./handlers/createProduct.handler";
import { Request } from "express";
import { OpenAPI } from "routing-controllers-openapi";
import { ProductBaseView } from "../../contracts/product/product.base.view";

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
  async createProduct(@Body() body: ProductBody, @Req() req: Request) {
    const {
      token: { userId },
    } = req;
    return createProduct(body, userId);
  }

  @Post("/type")
  @Authorized()
  @Representer(ProductBaseView, StatusCode.created)
  @OpenAPI({ summary: "Create a new product-type" })
  async createProductType(@Body() body: ProductBody) {
    return createProduct(body);
  }

  @Delete("/:id")
  @Authorized()
  @Representer(null)
  async deleteProduct(@Param("id") id: string) {
    return deleteProduct(id);
  }
}
