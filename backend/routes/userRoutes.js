import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  userProfileUpdate,
  getUserStats,
  listAllUsers,
  deleteUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();

// Public Routes
router.post("/auth", authUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);

// Private Route
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, upload.single("image"), userProfileUpdate);

// Admin (Private Route)
router.get("/admin/dashboard");
router.post("/admin/dashboard", deleteUser);

export { router };
