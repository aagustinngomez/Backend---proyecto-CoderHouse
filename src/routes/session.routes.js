import { Router } from "express";
import SessionController from "../controllers/SessionController.js";
import { passportCall } from "../utils/jwt.js";
import { authorization } from "../middleware/authorization.middleware.js";
import { RoleType } from "../constant/role.js";

export default class SessionRouter {
  path = "/session";
  router = Router();
  sessionController = new SessionController();

  constructor() {
    this.initSessionRoutes();
  }

  initSessionRoutes() {
    // Post login
    this.router.post(`${this.path}/login`, async (req, res, next) => {
      await this.sessionController.login(req, res, next);
    });

    // Get logout
    this.router.get(
      `${this.path}/logout`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      async (req, res, next) => {
        await this.sessionController.logout(req, res, next);
      }
    );

    // Delete user - this is for testing purposes
    this.router.delete(`${this.path}/remove/:uid`, async (req, res, next) => {
      await this.sessionController.removeUser(req, res, next);
    });

    // Register
    this.router.post(`${this.path}/register`, async (req, res, next) => {
      await this.sessionController.register(req, res, next);
    });

    // Get Github
    this.router.get(
      `${this.path}/github`,
      passportCall("github", { scope: ["user:email"], session: false }),
      async (req, res, next) => {
        await this.sessionController.github(req, res, next);
      }
    );

    // Get Callback Github
    this.router.get(
      `${this.path}/gitHubCallback`,
      passportCall("github", { session: false }),
      async (req, res, next) => {
        await this.sessionController.githubCallback(req, res, next);
      }
    );

    // Get session
    this.router.get(
      `${this.path}`,
      [passportCall("jwt"), authorization([RoleType.ADMIN, RoleType.USER, RoleType.PREMIUM])],
      async (req, res, next) => {
        await this.sessionController.getCurrentUser(req, res, next);
      }
    );

    // Begin password reset
    this.router.post(`${this.path}/password-reset/begin`, async (req, res, next) => {
      await this.sessionController.beginPasswordReset(req, res, next);
    });

    // Complete password reset
    this.router.post(`${this.path}/password-reset/complete`, async (req, res, next) => {
      await this.sessionController.completePasswordReset(req, res, next);
    });
  }
}