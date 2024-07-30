import UserManagerDao from "../dao/managers/userManager.manager.js";
import TemporaryCredentialsDao from "../dao/managers/temporaryCredentials.managers.js";
import { generateJWT } from "../utils/jwt.js";
import EmailService from "../services/emailService.js";
import config from "../config/config.js";
import { ClientError } from "../utils/ClientError.js";
import { ErrorCode } from "../utils/ErrorCode.js";
import { RoleType } from "../constant/role.js";

class SessionController {
  constructor() {
    this.userManager = new UserManagerDao();
    this.temporaryCredentialsManager = new TemporaryCredentialsDao();
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new ClientError("SessionController.login", ErrorCode.BAD_PARAMETERS, 400, "BAD PARAM", "Email and password are required");
      }

      const signUser = await this.userManager.login(email, password);
      if (!signUser) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = await generateJWT({ ...signUser });
      req.user = { ...signUser };
      res.cookie("eCommerceCookieToken", token, { maxAge: 1000 * 60 * 30, httpOnly: true });
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      if (!req.user) {
        throw new ClientError("SessionController.logout", ErrorCode.UNAUTHORIZED, 401, "UNAUTHORIZED", "User not authenticated");
      }

      await this.userManager.registerConnection(req.user.userId);
      res.clearCookie("eCommerceCookieToken").send();
    } catch (error) {
      next(error);
    }
  }

  async removeUser(req, res, next) {
    try {
      const userId = req.params.uid;
      await this.userManager.removeUser(userId);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const { firstName, lastName, email, role, age, password } = req.body;
      if (!firstName || !lastName || !email || !password) {
        throw new ClientError("SessionController.register", ErrorCode.BAD_PARAMETERS, 400, "BAD PARAM", "All fields are required");
      }

      let user = await this.userManager.getUserByEmail(email);
      if (user) {
        return res.status(400).json({ message: `User ${email} already exists` });
      }

      const newUser = { firstName, lastName, email, password, role, age };
      let signUser = await this.userManager.createUser(newUser);
      const token = await generateJWT({ ...signUser });

      req.user = { ...signUser };
      res.cookie("eCommerceCookieToken", token, { maxAge: 1000 * 60 * 30, httpOnly: true });
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async github(req, res, next) {
    try {
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async githubCallback(req, res, next) {
    try {
      const { user } = req;
      if (!user) {
        return res.status(400).json({ message: "Login failed" });
      }

      const token = await generateJWT({ ...user });
      req.user = { ...user };
      res.cookie("eCommerceCookieToken", token, { maxAge: 1000 * 60 * 30, httpOnly: true });
      return res.redirect("/views/cart");
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      if (!req.user) {
        throw new ClientError("SessionController.getCurrentUser", ErrorCode.UNAUTHORIZED, 401, "UNAUTHORIZED", "User not authenticated");
      }

      return res.status(200).json(req.user);
    } catch (error) {
      next(error);
    }
  }

  async beginPasswordReset(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) {
        throw new ClientError("SessionController.beginPasswordReset", ErrorCode.BAD_PARAMETERS, 400, "BAD PARAM", "Email is required");
      }

      const token = await this.temporaryCredentialsManager.createTemporaryCredentials(email);
      const emailService = new EmailService();
      await emailService.sendPasswordResetEmail(email, `${config.API_URL}/recover/${token}`);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async completePasswordReset(req, res, next) {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        throw new ClientError("SessionController.completePasswordReset", ErrorCode.BAD_PARAMETERS, 400, "BAD PARAM", "Token and password are required");
      }

      const user = await this.temporaryCredentialsManager.validateTemporaryCredentials(token);
      if (!user) {
        throw new ClientError("SessionController.completePasswordReset", ErrorCode.UNAUTHORISED, 403, "UNAUTHORIZED", "The link is no longer valid");
      }

      const tryPassword = await this.userManager.login(user.email, password);
      if (tryPassword) {
        throw new ClientError("SessionController.completePasswordReset", ErrorCode.SAME_PASSWORD);
      }

      await this.userManager.resetPassword({ email: user.email, password });
      const signUser = await this.userManager.login(user.email, password);
      if (!signUser) {
        throw new ClientError("SessionController.completePasswordReset", ErrorCode.UNAUTHORISED);
      }

      const newAccessToken = await generateJWT({ ...signUser });
      req.user = { ...signUser };
      res.cookie("eCommerceCookieToken", newAccessToken, { maxAge: 1000 * 60 * 30, httpOnly: true });
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new SessionController();