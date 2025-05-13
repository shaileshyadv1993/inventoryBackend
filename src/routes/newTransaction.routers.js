import { Router } from "express";
import {
  newTranscation,
  transHistory,
} from "../controllers/itemTransaction.controllers.js";
import authenticateUser from "../middleware/authentication.middlewares.js";
const router = Router();
router.route("/newtranscation").post(authenticateUser, newTranscation);
router.route("/transcationhistory/:id").get(authenticateUser, transHistory);
export default router;
