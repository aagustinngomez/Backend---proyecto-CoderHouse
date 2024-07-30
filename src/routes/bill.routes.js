import { Router } from "express";
import BillController from "../controllers/BillController.js";
import { authorization } from "../middleware/authorization.middleware.js";
import { passportCall } from "../utils/jwt.js";
import { RoleType } from "../constant/role.js";

class BillRouter {
  path = "/bill";
  router = Router();

  constructor() {
    this.initBillRoutes();
  }

  initBillRoutes() {
    // Get bill by ID
    this.router.get(
      `${this.path}/:bid`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      BillController.getBillById
    );

    // Begin checkout
    this.router.post(
      `${this.path}/:bid/begin-checkout`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      BillController.beginCheckout
    );

    // Finish checkout
    this.router.get(
      `${this.path}/:bid/finish-checkout`,
      BillController.finishCheckout
    );

    // Cancel checkout
    this.router.get(
      `${this.path}/:bid/cancel-checkout`,
      BillController.cancelCheckout
    );
  }
}

export default BillRouter;