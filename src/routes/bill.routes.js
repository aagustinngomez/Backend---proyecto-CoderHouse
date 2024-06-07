import { Router } from "express";
import BillManagerDao from "../dao/managers/billManager.managers.js";
import { passportCall } from "../utils/jwt.js";
import { authorization } from "../middleware/authorization.middleware.js";
import CartManagerDao from "../dao/managers/cartManager.managers.js";
<<<<<<< HEAD
import { RoleType } from "../constant/role.js";
import stripe from "../services/paymentService.js";
import config from "../config/config.js";
=======
import { ClientError } from "../utils/ClientError.js";
import { ErrorCode } from "../utils/ErrorCode.js";
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176

export default class BillRouter {
  path = "/bill";
  router = Router();
  billManager = new BillManagerDao();
  cartManager = new CartManagerDao();

  constructor() {
    this.initBillRoutes();
  }

  initBillRoutes() {
    //Get bill by ID
<<<<<<< HEAD
    this.router.get(
      `${this.path}/:bid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      async (req, res, next) => {
        try {
          const billId = req.params.bid;
          const billItems = await this.billManager.getBillById(billId);
          res.status(200).send({ status: "success", payload: billItems });
        } catch (error) {
          next(error);
        }
      }
    );

    this.router.post(
      `${this.path}/:bid/begin-checkout`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      async (req, res, next) => {
        try {
          const { API_URL, API_VERSION } = config;
          const billId = req.params.bid;
          const billItems = await this.billManager.getBillById(billId);
          const transactionId = await this.billManager.generateTransactionId(billId);
          const sucessUrl = new URL(`/api/${API_VERSION}/${this.path}/${billId}/finish-checkout`, API_URL);
          sucessUrl.searchParams.append("transactionId", transactionId);

          const cancelUrl = new URL(`/api/${API_VERSION}/${this.path}/${billId}/cancel-checkout`, API_URL);

          const session = await stripe.checkout.sessions.create({
            mode: "payment",
            success_url: sucessUrl.toString(),
            cancel_url: cancelUrl.toString(),

            line_items: billItems.products.map((item) => {
              return {
                quantity: item.quantity,
                price_data: {
                  currency: "GBP",
                  product_data: {
                    name: item.product.title,
                    images: [item.product.thumbnail],
                  },
                  unit_amount: item.price * 100,
                },
              };
            }),
          });

          res.status(200).send({ location: session.url });
        } catch (error) {
          next(error);
        }
      }
    );

    this.router.get(`${this.path}/:bid/finish-checkout`, async (req, res, next) => {
      try {
        const { API_URL } = config;
        const billId = req.params.bid;
        const transactionId = req.query.transactionId;

        await this.billManager.completePayment(billId, transactionId);

        res.redirect(303, `${API_URL}/views/success`);
      } catch (error) {
        next(error);
      }
    });

    this.router.get(`${this.path}/:bid/cancel-checkout`, async (req, res, next) => {
      try {
        const { API_URL } = config;
        const billId = req.params.bid;

        await this.billManager.cancelCheckout(billId);

        res.redirect(303, `${API_URL}/views/cancelled`);
=======
    this.router.get(`${this.path}/:bid`, [passportCall("jwt"), authorization(["ADMIN", "USER"])], async (req, res) => {
      try {
        const billId = req.params.bid;
        const billItems = await this.billManager.getBillById(billId);
        res.status(200).send({ status: "success", payload: billItems });
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176
      } catch (error) {
        next(error);
      }
    });
  }
}