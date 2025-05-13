import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const authenticateUser = (req, res, next) => {
  const cookie = req.cookies;

  const token = cookie?.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new ApiError(401, "Token not found. You are not authorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // set data of user
    next();
  } catch (error) {
    return next(new ApiError(403, "Invalid or expired token"));
  }
};

export default authenticateUser;
