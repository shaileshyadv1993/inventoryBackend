import { ItemTransaction } from "../models/itemTransaction.models.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";

// Create new Item transaction
const newTranscation = AsyncHandler(async (req, res) => {
  const { itemID, receivedQty, issuedQty, issuedTo, remark } = req.body;
  const userID = req.user.id;

  if (!itemID || !remark || !issuedTo) {
    throw new ApiError(403, "Enter all fields");
  }
  console.log(itemID, receivedQty, issuedQty, issuedTo, remark);
  console.log(userID);
  const newTrans = await ItemTransaction.create({
    itemID: itemID,
    receivedQty: receivedQty,
    issuedQty: issuedQty,
    issuedTo: issuedTo,
    issuedBy: userID,
    remark: remark,
  });
  if (!newTrans) {
    return new ApiError(500, "Error occured while creating new transcation.");
  }
  res.status(200).json("New transcation recorded");
});

// Get transcation history
const transHistory = AsyncHandler(async (req, res) => {
  const _id = req.params.id.trim();

  const itemHistory = await ItemTransaction.find({
    itemID: new mongoose.Types.ObjectId(_id),
  });
  if (itemHistory.length === 0) {
    return new ApiError(500, "Now transcation history found");
  }

  const items = await ItemTransaction.aggregate([
    {
      $match: { itemID: new mongoose.Types.ObjectId(_id) },
    },
    {
      $lookup: {
        from: "users",
        localField: "issuedBy",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $unwind: "$userInfo",
    },
    {
      $lookup: {
        from: "items",
        localField: "itemID",
        foreignField: "_id",
        as: "itemInfo",
      },
    },
    {
      $unwind: "$itemInfo",
    },
    {
      $lookup: {
        from: "categories",
        localField: "itemInfo.categoryID",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    {
      $unwind: "$categoryInfo",
    },
    {
      $project: {
        _id: 0,
        itemID: "$itemInfo.name",
        receivedQty: 1,
        issuedTo: 1,
        issuedQty: 1,
        issuedBy: "$userInfo.name",
        remark: 1,
        category: "$categoryInfo.name",
        createdAt: 1,
      },
    },
  ]);

  const stockSummary = await ItemTransaction.aggregate([
    {
      $match: { itemID: new mongoose.Types.ObjectId(_id) },
    },
    {
      $group: {
        _id: new mongoose.Types.ObjectId(_id),
        totalReceived: { $sum: "$receivedQty" },
        totalIssued: { $sum: "$issuedQty" },
      },
    },
    {
      $project: {
        _id: 0,
        stock: { $subtract: ["$totalReceived", "$totalIssued"] },
      },
    },
  ]);
  res.status(200).json({ history: items, stock: stockSummary });
});

export { newTranscation, transHistory };
