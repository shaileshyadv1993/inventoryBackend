import AsyncHandler from "../utils/AsyncHandler.js";
import { User } from "../models/users.models.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import ms from "ms";

// Generate Access and Refresh Token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    // console.log(user);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating Tokens");
  }
};

// User Register
const createUser = AsyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (name == "" || email == "" || password == "") {
    throw new Error(401, "Please provide all fields");
  }

  // Check User existance
  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new ApiError(404, "This email is already registered");
  }

  // User creation
  const user = User.create({ name, email, password, role });

  const userCreated = User.findById(user._id).select("-password -refreshtoken");

  if (!userCreated) {
    throw new ApiError(501, "Something error occured while creating user");
  }

  res.status(200).json({
    message: "User registered",
  });
});

// Get all users
const getuser = AsyncHandler(async (req, res) => {
  const allUsers = await User.find().select("-password -refreshToken");
  if (!allUsers) {
    return new ApiError(404, "Users list is empty");
  }
  res
    .status(200)
    .json({ allUsers: allUsers, message: "Here you have all users" });
});

// User login
const userLogin = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(404, "All fields are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    return new ApiError(404, "This email is not registered");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return new ApiError(401, "Incorrect password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const userLogedIn = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!userLogedIn) {
    return new ApiError(404, "User is not logged in");
  }
  const accessTokenOption = {
    httpOnly: true,
    secure: false || process.env.NODE_ENV === "production",
    sameSite: "None",
    // maxAge: ms(process.env.ACCESS_TOKEN_EXPIRES_IN), //The cookie will become a session cookie (deleted when the browser closes).

    // Even if the JWT is valid for 7 days, it’s gone if the browser closes.
  };
  const refreshTokenOption = {
    httpOnly: true,
    secure: false || process.env.NODE_ENV === "production",
    // maxAge: ms(process.env.REFRESH_TOKEN_EXPIRES_IN),
    sameSite: "None",
  };

  try {
    // Save refresh token to DB
    user.refreshToken = refreshToken;
    user.isActive = true;
    await user.save();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something wrong while updating refreshToken" });
  }

  res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOption)
    .cookie("refreshToken", refreshToken, refreshTokenOption)
    .json({
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        userData: userLogedIn,
      },
      message: "User logged in successfully",
    });
});

// Logout
const userLogOut = AsyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) {
    throw new ApiError(202, "No token");
  }
  const refreshToken = cookies.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.refreshToken = undefined; //Delete refresh token
  user.isActive = false;
  await user.save();

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json("User logged out successfully");
});

// delete user
const deleteUser = AsyncHandler(async (req, res) => {
  const { email } = req.body;
  const checkUser = await User.find({ email });

  if (checkUser.length === 0) {
    throw new ApiError(404, "User not found");
  }
  await User.deleteOne({ email });

  // if (result.deletedCount === 0) {
  //   throw new ApiError(500, "Failed to delete user");
  // }

  res.status(200).json("User deleted");
});

// update Password
const updatePassword = AsyncHandler(async (req, res) => {
  const user = req.user;
  const { oldPassword, newPassword } = req.body;
  const { id } = req.user;
  console.log(user);

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      password: hashedPassword,
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new ApiError(500, "Password updation failed");
  }
  res.status(200).json("Password updated successfully");
});

export {
  createUser,
  getuser,
  userLogin,
  userLogOut,
  deleteUser,
  updatePassword,
};
