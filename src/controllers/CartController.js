import CartManagerDao from "../dao/managers/cartManager.managers.js";
import BillManagerDao from "../dao/managers/billManager.managers.js";
import ProductManagerDao from "../dao/managers/productManager.managers.js";
import { ClientError } from "../utils/ClientError.js";
import { ErrorCode } from "../utils/ErrorCode.js";
import { RoleType } from "../constant/role.js";

class CartController {
  constructor() {
    this.cartManager = new CartManagerDao();
    this.billManager = new BillManagerDao();
    this.productManager = new ProductManagerDao();
  }

  async getCart(req, res, next) {
    try {
      const cart = await this.cartManager.getCart(req.user.userId);
      res.status(200).send({ status: "success", payload: cart });
    } catch (error) {
      next(error);
    }
  }

  async createCart(req, res, next) {
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

  async getCartById(req, res, next) {
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

  async addMultipleProductsToCart(req, res, next) {
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

  async deleteAllProducts(req, res, next) {
    try {
      const cartId = req.params.cid;
      const cart = await this.cartManager.deleteAllProducts(cartId);
      res.status(200).send({ status: "success", payload: cart });
    } catch (error) {
      next(error);
    }
  }

  async purchaseCart(req, res, next) {
    try {
      const cartId = req.params.cid;
      const cart = await this.cartManager.getCartById(cartId);
      const newBill = await this.billManager.createBill(cart);
      res.status(200).send({ status: "success", payload: newBill });
    } catch (error) {
      next(error);
    }
  }

  async addProductToCart(req, res, next) {
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

  async setProductQuantity(req, res, next) {
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

  async deleteProduct(req, res, next) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const cart = await this.cartManager.deleteProduct(cartId, productId);
      res.status(200).send({ status: "success", payload: cart });
    } catch (error) {
      next(error);
    }
  }

  async removeCart(req, res, next) {
    try {
      const cartId = req.params.cid;
      await this.cartManager.removeCart(cartId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new CartController();