import mongoose, { Schema } from "mongoose";

const machineSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    department: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Machine = mongoose.model("Machine", machineSchema);
