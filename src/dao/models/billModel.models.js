import mongoose, { Schema } from "mongoose";
<<<<<<< HEAD
import { BillStatus } from "../../utils/BillStatus.js";
=======
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176

const billCollection = "bill";

const billSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  code: {
    type: Schema.Types.String,
    unique: true,
    required: true,
  },
  date: {
    type: Schema.Types.Date,
    required: true,
  },
  total: {
    type: Schema.Types.Number,
    required: true,
  },
<<<<<<< HEAD
  transactionId: {
    type: Schema.Types.String,
  },
  status: {
    type: Schema.Types.String,
    required: true,
    default: BillStatus.NotPaid,
    enum: Object.values(BillStatus),
  },
=======
>>>>>>> dd7f0b44ac9e7a4d03f800e1077442c7e1e81176
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products",
        },
        price: {
          type: Schema.Types.Number,
          required: true,
        },
        quantity: {
          type: Schema.Types.Number,
          required: true,
          default: 1,
        },
      },
    ],
  },
});

export const billModel = mongoose.model(billCollection, billSchema);