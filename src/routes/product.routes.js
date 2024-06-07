import { Router } from "express";
import ProductManagerDao from "../dao/managers/productManager.managers.js";
import { authorization } from "../middleware/authorization.middleware.js";
import { passportCall } from "../utils/jwt.js";
import { ClientError } from "../utils/ClientError.js";
import { ErrorCode } from "../utils/ErrorCode.js";
<<<<<<< HEAD
import { RoleType } from "../constant/role.js";
=======
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176

export default class ProductRouter {
  path = "/product";
  router = Router();
  productManager = new ProductManagerDao();

  constructor() {
    this.initProductRoutes();
  }

  initProductRoutes() {
<<<<<<< HEAD
    this.router.get(
      `${this.path}`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      async (req, res, next) => {
        try {
          const { limit, page, sort, query } = req.query;
          const products = await this.productManager.getAllProducts(limit, page, sort, query, req.baseUrl);
          res.status(200);
          res.send({
            ...products,
            status: "success",
          });
          return;
        } catch (error) {
          next(error);
        }
      }
    );

    //Get product by ID
    this.router.get(
      `${this.path}/:pid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      async (req, res, next) => {
        try {
          const productId = req.params.pid;
          const product = await this.productManager.getProductById(productId);
          if (!product) {
            throw new ClientError(`${this.path}/${productId}`, ErrorCode.PRODUCT_MISSING);
          } else {
            res.json(product);
          }
        } catch (error) {
          next(error);
        }
      }
    );

    // Mocking products endpoint
    this.router.get(`/mockingproducts`, async (req, res, next) => {
=======
    // Get products
    this.router.get(`${this.path}`, [passportCall("jwt"), authorization(["ADMIN", "USER"])], async (req, res, next) => {
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176
      try {
        const { limit, page, sort, query } = req.query;
        const products = await this.productManager.getAllFakeProducts(limit, page, sort, query, req.baseUrl);
        res.status(200);
        res.send({
          ...products,
          status: "success",
        });
        return;
      } catch (error) {
        next(error);
<<<<<<< HEAD
=======
      }
    });

    //Get product by ID
    this.router.get(
      `${this.path}/:pid`,
      [passportCall("jwt"), authorization(["ADMIN", "USER"])],
      async (req, res, next) => {
        try {
          const productId = req.params.pid;
          const product = await this.productManager.getProductById(productId);
          if (!product) {
            throw new ClientError(`${this.path}/${productId}`, ErrorCode.PRODUCT_MISSING);
          } else {
            res.json(product);
          }
        } catch (error) {
          next(error);
        }
      }
    );

    // Mocking products endpoint
    this.router.get(`/mockingproducts`, async (req, res, next) => {
      try {
        const { limit, page, sort, query } = req.query;
        const products = await this.productManager.getAllFakeProducts(limit, page, sort, query, req.baseUrl);
        res.status(200);
        res.send({
          ...products,
          status: "success",
        });
        return;
      } catch (error) {
        next(error);
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176
      }
    });

    //Post
<<<<<<< HEAD
    this.router.post(
      `${this.path}`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.PREMIUM])],
      async (req, res, next) => {
        try {
          const { body, io } = req;
          const newProduct = await this.productManager.addProduct({
            ...body,
            owner: req.user.role === RoleType.PREMIUM ? req.user.email : "admin",
          });
          if (!newProduct) {
            throw new ClientError(`${this.path}`, ErrorCode.PRODUCT_MISSING);
          }

          const products = await this.productManager.getAllProducts();
          io.emit("newProductsList", products);
          io.emit("newProductMessage", "New product arrived!!");

          res.status(200).json(newProduct);
        } catch (error) {
          next(error);
        }
      }
    );

    //Post
    this.router.post(
      `${this.path}/:pid/stock/:quantity`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.PREMIUM])],
      async (req, res, next) => {
        try {
          const productId = req.params.pid;
          const quantity = req.params.quantity;

          if (req.user.role !== RoleType.ADMIN && !(await this.productManager.isProductOwner(req.user, productId))) {
            throw new ClientError("Cart", ErrorCode.UNAUTHORISED);
          }

          await this.productManager.changeStockForProduct(productId, quantity);
          const products = await this.productManager.getAllProducts();
          res.status(200).json(products);
        } catch (error) {
          next(error);
        }
      }
    );
=======
    this.router.post(`${this.path}`, [passportCall("jwt"), authorization(["ADMIN"])], async (req, res, next) => {
      try {
        const { body, io } = req;
        const newProduct = await this.productManager.addProduct(body);
        if (!newProduct) {
          throw new ClientError(`${this.path}`, ErrorCode.PRODUCT_MISSING);
        }

        const products = await this.productManager.getAllProducts();
        io.emit("newProductsList", products);
        io.emit("newProductMessage", "New product arrived!!");

        res.status(200).json(newProduct);
      } catch (error) {
        next(error);
      }
    });
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176

    //Post
    this.router.post(
      `${this.path}/:pid/stock/:quantity`,
      [passportCall("jwt"), authorization(["ADMIN", "USER"])],
      async (req, res, next) => {
        try {
          const productId = req.params.pid;
          const quantity = req.params.quantity;

          await this.productManager.changeStockForProduct(productId, quantity);
          const products = await this.productManager.getAllProducts();
          res.status(200).json(products);
        } catch (error) {
          next(error);
        }
      }
    );

    //Put
<<<<<<< HEAD
    this.router.put(
      `${this.path}/:pid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.PREMIUM])],
      async (req, res, next) => {
        try {
          const productId = req.params.pid;
          const { title, description, price, thumbnail, code, stock } = req.body;

          if (req.user.role !== RoleType.ADMIN && !(await this.productManager.isProductOwner(req.user, productId))) {
            throw new ClientError("Cart", ErrorCode.UNAUTHORISED);
          }

          const updatedProduct = await this.productManager.updateProduct(productId, {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
          });

          res.json({ product: updatedProduct });
        } catch (error) {
          next(error);
        }
=======
    this.router.put(`${this.path}/:pid`, [passportCall("jwt"), authorization(["ADMIN"])], async (req, res, next) => {
      try {
        const productId = req.params.pid;
        const { title, description, price, thumbnail, code, stock } = req.body;
        const updatedProduct = await this.productManager.updateProduct(productId, {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        });

        res.json({ product: updatedProduct });
      } catch (error) {
        next(error);
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176
      }
    );

    //Delete
<<<<<<< HEAD
    this.router.delete(
      `${this.path}/:pid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.PREMIUM])],
      async (req, res, next) => {
        try {
          const productId = req.params.pid;

          if (req.user.role !== RoleType.ADMIN && !(await this.productManager.isProductOwner(req.user, productId))) {
            throw new ClientError("Product", ErrorCode.UNAUTHORISED);
          }

          await this.productManager.removeProduct(productId);
          res.status(204);
          res.send();
        } catch (error) {
          next(error);
        }
=======
    this.router.delete(`${this.path}/:pid`, [passportCall("jwt"), authorization(["ADMIN"])], async (req, res, next) => {
      try {
        const productId = req.params.pid;
        await this.productManager.removeProduct(productId);
        res.status(204);
        res.send();
      } catch (error) {
        next(error);
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176
      }
    );
  }
}