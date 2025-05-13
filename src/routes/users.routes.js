import {
  createUser,
  getuser,
  userLogin,
  userLogOut,
  deleteUser,
  updatePassword,
} from "../controllers/users.controllers.js";
import authenticateUser from "../middleware/authentication.middlewares.js";
import userAuthorization from "../middleware/authorization.middlewares.js";
import { Router } from "express";

const router = Router();

router.route("/create-user").post(createUser);
router.route("/get-user").get(authenticateUser, userAuthorization, getuser);
router.route("/login").post(userLogin);
router.route("/logout").post(userLogOut);
router.route("/update-password").post(authenticateUser, updatePassword);
router
  .route("/delete-user")
  .delete(authenticateUser, userAuthorization, deleteUser);

export default router;
// This code imports the `createUser` function from the `users.controllers.js` file and creates an Express router. It defines a POST route at `/create-user` that calls the `createUser` function when a request is made to that endpoint. Finally, it exports the router for use in other parts of the application.
// This is a common pattern in Express.js applications to organize routes and controllers separately for better maintainability and readability.
// The `createUser` function is expected to handle the logic for creating a user, such as validating input, saving the user to a database, and sending a response back to the client.
