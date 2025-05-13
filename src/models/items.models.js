import mongoose, { Schema } from "mongoose";
import { User } from "./users.models.js";
import { Category } from "./category.models.js";

const itemSchema = new Schema(
  {
    categoryID: {
      type: mongoose.Types.ObjectId,
      ref: Category,
    },

    name: {
      type: String,
      required: true,
    },

    model_no: {
      type: String,
    },

    part_no: {
      type: String,
      required: true,
      unique: true,
    },

    make: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  { timestamps: true }
);

export const Item = mongoose.model("Item", itemSchema);
