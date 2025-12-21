import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  userProfileUpdate,
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
export { router };
