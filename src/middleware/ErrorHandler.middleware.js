import { ErrorCode } from "../utils/ErrorCode.js";

export const ErrorHandler = (error, req, res, next) => {
  req.logger.error(JSON.stringify(error));
  switch (error.code) {
    case ErrorCode.BAD_PARAMETERS:
      res.status(error.httpStatus).send({
<<<<<<< HEAD
        message: error.message || "Bad parameters",
=======
        error,
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176
        status: "error",
      });
      break;
    case ErrorCode.UNAUTHORISED:
      res.status(error.httpStatus).send({
<<<<<<< HEAD
        message: error.message || "Unauthorised",
=======
        error: error.message,
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176
        status: "error",
      });
      break;
    case ErrorCode.CART_MISSING:
      res.status(404).send({
<<<<<<< HEAD
        message: error.message || "could not find the cart",
=======
        error: "could not find the cart",
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176
        status: "error",
      });
      break;
    case ErrorCode.BILL_MISSING:
      res.status(404).send({
<<<<<<< HEAD
        message: error.message || "could not find the bill",
=======
        error: "could not find the bill",
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176
        status: "error",
      });
      break;
    case ErrorCode.PRODUCT_MISSING:
      res.status(404).send({
<<<<<<< HEAD
        message: error.message || "could not find the product",
=======
        error: "could not find the product",
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176
        status: "error",
      });
      break;
    case ErrorCode.DB_ISSUE:
      res.status(500).send({
<<<<<<< HEAD
        message: error.message || "There is something wrong with the call to the DB",
        status: "error",
      });
      break;
    case ErrorCode.SAME_PASSWORD:
      res.status(400).send({
        message: error.message || "You can't use the same password",
=======
        error: { ...error, message: "There is something wrong with the call to the DB" },
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176
        status: "error",
      });
      break;
    default:
      res.send({
<<<<<<< HEAD
        message: error.message || "Unhandled error",
=======
        error: "Unhandled error",
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176
        status: "error",
      });
  }
};