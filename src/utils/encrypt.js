import bcrypt from "bcrypt";
import crypto from "crypto";

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (existingUser, incomingPassword) =>
<<<<<<< HEAD
  bcrypt.compareSync(incomingPassword, existingUser.password);

export const generateToken = () => crypto.randomBytes(48).toString("base64url");
=======
  bcrypt.compareSync(incomingPassword, existingUser.password);
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176
