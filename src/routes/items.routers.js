import { Router } from "express";
import {
  createItem,
  deleteItem,
  getAllItems,
  itemMatch,
} from "../controllers/items.controllers.js";
import authenticateUser from "../middleware/authentication.middlewares.js";
import userAuthorization from "../middleware/authorization.middlewares.js";

const router = Router();

router.route("/create-item").post(authenticateUser, createItem);
router
  .route("/delete-item/:id")
  .delete(authenticateUser, userAuthorization, deleteItem);
router.route("/getallitems").get(authenticateUser, getAllItems);
router.route("/item-match/:id").get(authenticateUser, itemMatch);
export default router;
