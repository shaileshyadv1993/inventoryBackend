import { Category } from "../models/category.models.js";
import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";

// Create category
const createCategory = AsyncHandler(async (req, res) => {
  const { category } = req.body;
  if (category.trim() == "") {
    return res.status(403).json("Please provide category");
  }
  const categoryToCreate = await Category.find({
    name: { $regex: `^${category}$`, $options: "i" },
  });

  if (categoryToCreate.length === 0) {
    await Category.create({ name: category });
    return res.status(201).json({
      message: `Category with name ${category} was not found and has been created.`,
    });
  }
  res.status(200).json(`${category} already exist`);
});

//Get all categories
const getAllCategories = AsyncHandler(async (req, res) => {
  const allCategories = await Category.find();
  if (allCategories.length === 0) {
    return new ApiError(404, "Category does not exist");
  }
  res.status(200).json(allCategories);
});
export { createCategory, getAllCategories };
