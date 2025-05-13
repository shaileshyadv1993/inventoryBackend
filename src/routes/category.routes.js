import { Router } from "express";
import { createCategory } from "../controllers/category.controllers.js";
import userAuthorization from "../middleware/authorization.middlewares.js"; // Check for admin role
import authenticateUser from "../middleware/authentication.middlewares.js"; //Check for logged In

import { getAllCategories } from "../controllers/category.controllers.js";

const router = Router();

router
  .route("/create-category")
  .post(authenticateUser, userAuthorization, createCategory);
router.route("/getallcategories").get(authenticateUser, getAllCategories);

export default router;
