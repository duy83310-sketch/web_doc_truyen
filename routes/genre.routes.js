import express from "express";
import * as genresController from "../controllers/genrescontroller.js";
import {
  authenticateJWT,
  requireAdmin,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public: Lấy danh sách (Cho trang Home filter, trang StoryForm dropdown...)
router.get("/", genresController.getAllGenres);

// Admin Only: Thêm, Sửa, Xóa
router.post("/", authenticateJWT, requireAdmin, genresController.createGenre);
router.put("/:id", authenticateJWT, requireAdmin, genresController.updateGenre);
router.delete(
  "/:id",
  authenticateJWT,
  requireAdmin,
  genresController.deleteGenre
);

export default router;
