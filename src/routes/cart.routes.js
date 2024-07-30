import { Router } from "express";
import CartController from "../controllers/CartController.js";
import { passportCall } from "../utils/jwt.js";
import { authorization } from "../middleware/authorization.middleware.js";
import { RoleType } from "../constant/role.js";

class CartRouter {
  path = "/cart";
  router = Router();

  constructor() {
    this.initCartRoutes();
  }

  initCartRoutes() {
    this.router.get(
      `${this.path}`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      CartController.getCart
    );

    this.router.post(
      `${this.path}`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      CartController.createCart
    );

    this.router.get(
      `${this.path}/:cid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      CartController.getCartById
    );

    this.router.put(
      `${this.path}/:cid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      CartController.addMultipleProductsToCart
    );

    this.router.delete(
      `${this.path}/:cid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      CartController.deleteAllProducts
    );

    this.router.post(
      `${this.path}/:cid/purchase`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      CartController.purchaseCart
    );

    this.router.post(
      `${this.path}/:cid/product/:pid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      CartController.addProductToCart
    );

    this.router.put(
      `${this.path}/:cid/product/:pid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      CartController.setProductQuantity
    );

    this.router.delete(
      `${this.path}/:cid/product/:pid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      CartController.deleteProduct
    );

    this.router.delete(
      `${this.path}/:cid/removeCart`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      CartController.removeCart
    );
  }
}

export default CartRouter;