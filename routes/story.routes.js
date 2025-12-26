import express from "express";
import * as storiesController from "../controllers/storiescontroller.js";
import {
  authenticateJWT,
  requireAdmin,
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js"; // Import middleware vừa tạo

const router = express.Router();
console.log(">>> story.router loaded");

// Public routes
router.get("/", storiesController.getAllStories);
router.get("/search", storiesController.searchStories);
router.get("/:id", storiesController.getStoryById);

// Admin routes (Có xử lý upload ảnh)
// upload.single('image') nghĩa là frontend phải gửi field tên là 'image'
router.post(
  "/",
  authenticateJWT,
  requireAdmin,
  upload.single("image"),
  storiesController.createStory
);
router.put(
  "/:id",
  authenticateJWT,
  requireAdmin,
  upload.single("image"),
  storiesController.updateStory
);
router.delete("/:id", authenticateJWT, storiesController.deleteStory);

// User routes
router.get("/user/:userId", storiesController.getStoriesByUser);

export default router;
