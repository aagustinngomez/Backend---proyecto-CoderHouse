import { Router } from "express";
import CartManagerDao from "../dao/managers/cartManager.managers.js";
import { passportCall } from "../utils/jwt.js";
import { authorization } from "../middleware/authorization.middleware.js";
import BillManagerDao from "../dao/managers/billManager.managers.js";
import ProductManagerDao from "../dao/managers/productManager.managers.js";
import { RoleType } from "../constant/role.js";
import { ClientError } from "../utils/ClientError.js";
import { ErrorCode } from "../utils/ErrorCode.js";

export default class CartRouter {
  path = "/cart";
  router = Router();
  cartManager = new CartManagerDao();
  billManager = new BillManagerDao();
  productManager = new ProductManagerDao();

  constructor() {
    this.initCartRoutes();
  }

  initCartRoutes() {
    //Get cart
    this.router.get(
      `${this.path}`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      async (req, res, next) => {
        try {
          const cart = await this.cartManager.getCart(req.user.userId);
          res.status(200).send({ status: "success", payload: cart });
        } catch (error) {
          next(error);
        }
        return;
      }
    );

    //Post to create a new cart
    this.router.post(
      `${this.path}`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      async (req, res, next) => {
        try {
          const { io } = req;
          const newCart = await this.cartManager.createCart(req.user.userId);

          io.emit("newCartList", newCart);
          io.emit("newCartMessage", "New cart!!");

          res.status(200).send({ status: "success", payload: newCart });
        } catch (error) {
          next(error);
        }
      }
    );

    //Get cart by ID
    this.router.get(
      `${this.path}/:cid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      async (req, res, next) => {
        try {
          const cartId = req.params.cid;
          const cartItems = await this.cartManager.getCartById(cartId);
          if (cartItems.user.id !== req.user.userId) {
            res.status(401).send({ status: "error", payload: "Unauthorised" });
            return;
          }

          res.status(200).send({ status: "success", payload: cartItems });
        } catch (error) {
          next(error);
        }
      }
    );

    //Put to add multiple products to the cart
    this.router.put(
      `${this.path}/:cid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      async (req, res, next) => {
        try {
          const cartId = req.params.cid;
          const products = req.body.products;

          for (const productId of products) {
            if (req.user.role !== RoleType.ADMIN && (await this.productManager.isProductOwner(req.user, productId))) {
              throw new ClientError("Cart", ErrorCode.UNAUTHORISED);
            }
          }

          const cart = await this.cartManager.addMultipleProductsToCart(cartId, products);

          res.status(200).send({ status: "success", payload: cart });
        } catch (error) {
          next(error);
        }
      }
    );

    // deletes all products from the cart
    this.router.delete(
      `${this.path}/:cid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      async (req, res, next) => {
        try {
          const cartId = req.params.cid;
          const cart = await this.cartManager.deleteAllProducts(cartId);
          res.status(200).send({ status: "success", payload: cart });
        } catch (error) {
          next(error);
        }
      }
    );

    this.router.post(
      `${this.path}/:cid/purchase`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      async (req, res, next) => {
        try {
          const cartId = req.params.cid;
          const cart = await this.cartManager.getCartById(cartId);
          const newBill = await this.billManager.createBill(cart);

          res.status(200).send({ status: "success", payload: newBill });
        } catch (error) {
          next(error);
        }
      }
    );

    //Post to add a product to the cart by ID
    this.router.post(
      `${this.path}/:cid/product/:pid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      async (req, res, next) => {
        try {
          const cartId = req.params.cid;
          const productId = req.params.pid;

          if (req.user.role !== RoleType.ADMIN && (await this.productManager.isProductOwner(req.user, productId))) {
            throw new ClientError("Cart", ErrorCode.UNAUTHORISED);
          }

          const cart = await this.cartManager.addProductToCart(cartId, productId);
          res.status(200).send({ status: "success", payload: cart });
        } catch (error) {
          next(error);
        }
      }
    );

    //Put to modify quantity of a product in a cart
    this.router.put(
      `${this.path}/:cid/product/:pid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      async (req, res, next) => {
        try {
          const cartId = req.params.cid;
          const productId = req.params.pid;
          const quantity = req.body.quantity;

          if (req.user.role !== RoleType.ADMIN && (await this.productManager.isProductOwner(req.user, productId))) {
            throw new ClientError("Cart", ErrorCode.UNAUTHORISED);
          }

          const cart = await this.cartManager.setProductQuantity(cartId, productId, quantity);
          res.status(200).send({ status: "success", payload: cart });
        } catch (error) {
          next(error);
        }
      }
    );

    // deletes one product from the cart
    this.router.delete(
      `${this.path}/:cid/product/:pid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      async (req, res, next) => {
        try {
          const cartId = req.params.cid;
          const productId = req.params.pid;
          const cart = await this.cartManager.deleteProduct(cartId, productId);
          res.status(200).send({ status: "success", payload: cart });
        } catch (error) {
          next(error);
        }
      }
    );

    // deletes a cart completely
    this.router.delete(
      `${this.path}/:cid/removeCart`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      async (req, res, next) => {
        try {
          const cartId = req.params.cid;

          await this.cartManager.removeCart(cartId);
          res.status(204).send();
        } catch (error) {
          next(error);
        }
      }
    );
  }
}