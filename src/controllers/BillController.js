import BillManagerDao from "../dao/managers/billManager.managers.js";
import CartManagerDao from "../dao/managers/cartManager.managers.js";
import stripe from "../services/paymentService.js";
import config from "../config/config.js";
import { ClientError } from "../utils/ClientError.js";
import { ErrorCode } from "../utils/ErrorCode.js";

class BillController {
  constructor() {
    this.billManager = new BillManagerDao();
    this.cartManager = new CartManagerDao();
  }

  async getBillById(req, res, next) {
    try {
      const billId = req.params.bid;
      const billItems = await this.billManager.getBillById(billId);
      res.status(200).send({ status: "success", payload: billItems });
    } catch (error) {
      next(error);
    }
  }

  async beginCheckout(req, res, next) {
    try {
      const { API_URL, API_VERSION } = config;
      const billId = req.params.bid;
      const billItems = await this.billManager.getBillById(billId);
      const transactionId = await this.billManager.generateTransactionId(billId);
      const sucessUrl = new URL(`/api/${API_VERSION}/bill/${billId}/finish-checkout`, API_URL);
      sucessUrl.searchParams.append("transactionId", transactionId);

      const cancelUrl = new URL(`/api/${API_VERSION}/bill/${billId}/cancel-checkout`, API_URL);

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: sucessUrl.toString(),
        cancel_url: cancelUrl.toString(),
        line_items: billItems.products.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "GBP",
            product_data: {
              name: item.product.title,
              images: [item.product.thumbnail],
            },
            unit_amount: item.price * 100,
          },
        })),
      });

      res.status(200).send({ location: session.url });
    } catch (error) {
      next(error);
    }
  }

  async finishCheckout(req, res, next) {
    try {
      const { API_URL } = config;
      const billId = req.params.bid;
      const transactionId = req.query.transactionId;

      await this.billManager.completePayment(billId, transactionId);
      res.redirect(303, `${API_URL}/views/success`);
    } catch (error) {
      next(error);
    }
  }

  async cancelCheckout(req, res, next) {
    try {
      const { API_URL } = config;
      const billId = req.params.bid;

      await this.billManager.cancelCheckout(billId);
      res.redirect(303, `${API_URL}/views/cancelled`);
    } catch (error) {
      next(error);
    }
  }
}

export default new BillController();