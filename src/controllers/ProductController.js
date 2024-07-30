import ProductManagerDao from "../dao/managers/productManager.managers.js";
import { ClientError } from "../utils/ClientError.js";
import { ErrorCode } from "../utils/ErrorCode.js";

class ProductController {
  constructor() {
    this.productManager = new ProductManagerDao();
  }

  async getAllProducts(req, res, next) {
    try {
      const { limit, page, sort, query } = req.query;
      const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
      const products = await this.productManager.getAllProducts(limit, page, sort, query, baseUrl);
      res.status(200).send({ status: "success", payload: products });
    } catch (error) {
      next(error);
    }
  }

  async getAllFakeProducts(req, res, next) {
    try {
      const { limit, page } = req.query;
      const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
      const products = await this.productManager.getAllFakeProducts(limit, page, undefined, undefined, baseUrl);
      res.status(200).send({ status: "success", payload: products });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const productId = req.params.id;
      const product = await this.productManager.getProductById(productId);
      if (!product) {
        throw new ClientError("ProductController.getProductById", ErrorCode.NOT_FOUND, 404, "Product not found");
      }
      res.status(200).send({ status: "success", payload: product });
    } catch (error) {
      next(error);
    }
  }

  async addProduct(req, res, next) {
    try {
      const product = req.body;
      const newProduct = await this.productManager.addProduct(product);
      res.status(201).send({ status: "success", payload: newProduct });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const productId = req.params.id;
      const productToUpdate = req.body;
      const updatedProduct = await this.productManager.updateProduct(productId, productToUpdate);
      res.status(200).send({ status: "success", payload: updatedProduct });
    } catch (error) {
      next(error);
    }
  }

  async removeProduct(req, res, next) {
    try {
      const productId = req.params.id;
      await this.productManager.removeProduct(productId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async changeStockForProduct(req, res, next) {
    try {
      const productId = req.params.id;
      const { quantity } = req.body;
      await this.productManager.changeStockForProduct(productId, quantity);
      res.status(200).send({ status: "success", message: "Stock updated" });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();