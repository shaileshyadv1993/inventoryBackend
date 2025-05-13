import mongoose, { Schema } from "mongoose";
import { Item } from "../models/items.models.js";
import { User } from "./users.models.js";
import { Machine } from "./machines.models.js";

const itemTransactionSchema = new Schema(
  {
    itemID: {
      type: mongoose.Types.ObjectId,
      ref: Item,
      required: true,
    },
    receivedQty: {
      type: Number,
      default: 0,
    },
    issuedQty: {
      type: Number,
      default: 0,
    },
    issuedTo: {
      type: String,
      default: "",
    },
    issuedBy: {
      type: mongoose.Types.ObjectId,
      ref: User,
      required: true,
    },
    machineID: {
      type: mongoose.Types.ObjectId,
      ref: Machine,
    },
    remark: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const ItemTransaction = mongoose.model(
  "ItemTransaction",
  itemTransactionSchema
);
