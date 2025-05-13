import {
  createTodo,
  getTodos,
  findTODO,
  updateTODO,
  deleteTodo,
} from "../controllers/todos.controllers.js";

import { Router } from "express";
import authenticateUser from "../middleware/authentication.middlewares.js";
const router = Router();

router.route("/create-todo").post(authenticateUser, createTodo);
router.route("/getalltodos").post(authenticateUser, getTodos);
router.route("/gettodo/:id").get(authenticateUser, findTODO);
router.route("/update-todo/:id").patch(authenticateUser, updateTODO);
router.route("/delete-todo/:id").delete(authenticateUser, deleteTodo);

export default router;
