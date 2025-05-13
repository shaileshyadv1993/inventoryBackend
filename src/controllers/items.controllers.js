import { Item } from "../models/items.models.js";
import { Category } from "../models/category.models.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";

// Create item
const createItem = AsyncHandler(async (req, res) => {
  const { name, part_no, make, categoryID } = req.body;
  const userID = req.user.id;

  // Validate input
  if (!name || name.trim() === "") {
    throw new ApiError(400, "Please enter a description of the item");
  }

  // Check for existing item
  const existingItem = await Item.findOne({ name: name.trim() });
  if (existingItem) {
    throw new ApiError(409, "Item already exists");
  }

  const newItem = await Item.create({
    name: name.trim(),
    part_no,
    make,
    createdBy: userID,
    categoryID: categoryID,
  });

  res.status(201).json({
    message: "Item created successfully",
    item: newItem,
  });
});

// delete Item
const deleteItem = AsyncHandler(async (req, res) => {
  const _id = req.params.id;
  const item = await Item.findByIdAndDelete(_id);
  if (!item) {
    return res
      .status(404)
      .json("Either item does not exist or error in deleting ");
  }
  res.status(200).json({
    message: "Item deleted successfully",
    deletedItem: item, // Optional: return deleted item info
  });
});

// Get all items
const getAllItems = AsyncHandler(async (req, res) => {
  const allItems = await Item.find();

  res.status(200).json({
    message:
      allItems.length === 0
        ? "No items found."
        : "Items retrieved successfully.",
    data: allItems,
  });
});

// item-match by category
const itemMatch = AsyncHandler(async (req, res) => {
  const category = req.params.id.trim();
  const items = await Item.aggregate([
    {
      $match: {
        categoryID: new mongoose.Types.ObjectId(category),
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryID",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    {
      $unwind: "$categoryInfo", // Flatten the categoryInfo array
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },

    {
      $project: {
        name: 1,
        part_no: 1,
        make: 1,
        Category: "$categoryInfo.name",
        CreatedBy: "$userInfo.name",
        CreatedOn: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$userInfo.createdAt",
          },
        },
      },
    },
  ]);
  if (items.length == 0) {
    return new ApiError(400, "No match found");
  }
  res.status(200).json(items);
});

export { createItem, deleteItem, getAllItems, itemMatch };
