import { Router } from "express";
import ProductController from "../controllers/ProductController.js";
import { authorization } from "../middleware/authorization.middleware.js";
import { passportCall } from "../utils/jwt.js";
import { RoleType } from "../constant/role.js";

class ProductRouter {
  path = "/product";
  router = Router();

  constructor() {
    this.initProductRoutes();
  }

  initProductRoutes() {
    this.router.get(
      `${this.path}`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      ProductController.getAllProducts
    );

    this.router.get(
      `${this.path}/:pid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      ProductController.getProductById
    );

    this.router.post(
      `${this.path}`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.PREMIUM])],
      ProductController.createProduct
    );

    this.router.post(
      `${this.path}/:pid/stock/:quantity`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.PREMIUM])],
      ProductController.updateProductStock
    );

    this.router.put(
      `${this.path}/:pid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.PREMIUM])],
      ProductController.updateProduct
    );

    this.router.delete(
      `${this.path}/:pid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.PREMIUM])],
      ProductController.deleteProduct
    );

    this.router.get(
      `/mockingproducts`,
      ProductController.getMockingProducts
    );
  }
}

export default ProductRouter;