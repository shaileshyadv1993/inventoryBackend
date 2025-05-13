import mongoose from "mongoose";
import { Schema } from "mongoose";
import { User } from "./users.models.js";

const todoSchema = new Schema(
  {
    userID: {
      type: mongoose.Types.ObjectId,
      ref: User,
      required: true,
    },
    task: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled", "in-progress"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TODO = mongoose.model("TODO", todoSchema);
