import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// Public Routes
router.post("/auth", authUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);

// Private Route
router.get("/profile", protect, getUserProfile);

export { router };
