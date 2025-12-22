import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";
// These functions are for the user

// @desc   Authenticate a User
// @router POST /api/user/auth
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  }
  res.status(400);
  throw new Error("Invalid email or password");
});

// @desc   Register a new user
// @route  POST /api/user/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password != confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(401);
    throw new Error("User already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  generateToken(res, user._id);
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

// @desc   Logout a User
// @route  POST /api/user/logout
// @access Private
// controllers/userController.js (logout)
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_DEV === "production",
    sameSite: "none",
    path: "/",
  });

  return res.status(200).json({ message: "User logged out" });
});

// @desc   Get user Profile
// @route  Get /api/user/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    profilePic: req.user.profilePic || "",
  });
});

// @desc   Update User Profile
// @route  PUT/api/user/profile
// @access Private
const userProfileUpdate = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password && password !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match!");
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.name = name || user.name;
  user.email = email || user.email;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }
  if (req.file) {
    if (user.profilePicPublicId) {
      await cloudinary.uploader.destroy(user.profilePicPublicId);
    }
    user.profilePic = req.file.path || user.profilePic;
    user.profilePicPublicId = req.file.filename || user.profilePicPublicId;
  }
  const updatedUser = await user.save();
  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    profilePic: updatedUser.profilePic,
  });
});

// These functions are for the Admin

// @desc   Get all users stat
// @route  Get /api/admin/dashboard
// @access Private
const getUserStats = asyncHandler(async (req, res) => {
  const result = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
      },
    },
  ]);
  const count = result.length > 0 ? result[0].totalUsers : 0;
  res.status(200).json({
    totalUsers: count,
  });
});

// @desc   List all users
// @router GET /api/admin/dashboard/users
// @access Private
const listAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  if (users.length === 0) {
    res.status(404);
    throw new Error("No user found");
  }
  res.status(200).json(users);
});

// @desc   Delete a user
// @route  POST /api/admin/
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.profilePicPublicId) {
    await cloudinary.uploader.destroy(user.profilePicPublicId);
  }
  const deletedUser = await User.findByIdAndDelete(userId);
  res.status(200).json({
    message: "User deleted successfully!",
    deletedUser,
  });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  userProfileUpdate,
  getUserStats,
  listAllUsers,
  deleteUser,
};
