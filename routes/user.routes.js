import express from "express";
import * as usersController from "../controllers/userscontroller.js";
import {
  authenticateJWT,
  requireAdmin,
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js"; // Import middleware xử lý ảnh

const router = express.Router();

console.log(">>> User Routes Loaded");

// ==========================================
// 1. ROUTES CÁ NHÂN (USER TỰ THAO TÁC)
// (Phải đặt trước route /:id để tránh xung đột)
// ==========================================

// Cập nhật thông tin cá nhân + Upload Avatar
// Endpoint: PUT /api/users/profile
router.put(
  "/profile",
  authenticateJWT,
  upload.single("avatar"),
  usersController.updateProfile
);

// Đổi mật khẩu
// Endpoint: PUT /api/users/change-password
router.put("/change-password", authenticateJWT, usersController.changePassword);

// Lấy thông tin bản thân (Thường dùng /auth/me, nhưng nếu bạn muốn để ở đây cũng được)
// Endpoint: GET /api/users/me
if (usersController.getProfile) {
  router.get("/me", authenticateJWT, usersController.getProfile);
}

// ==========================================
// 2. ROUTES QUẢN TRỊ (ADMIN ONLY)
// ==========================================

// Lấy danh sách tất cả người dùng
// Endpoint: GET /api/users
router.get("/", authenticateJWT, requireAdmin, usersController.getAllUsers);

// Xóa người dùng theo ID
// Endpoint: DELETE /api/users/:id
router.delete(
  "/:id",
  authenticateJWT,
  requireAdmin,
  usersController.deleteUser
);

// Lấy chi tiết người dùng bất kỳ (Admin xem)
// Endpoint: GET /api/users/:id
if (usersController.getUserById) {
  router.get(
    "/:id",
    authenticateJWT,
    requireAdmin,
    usersController.getUserById
  );
}

// Cập nhật người dùng bất kỳ (Admin sửa user khác - nếu cần)
// Endpoint: PUT /api/users/:id
if (usersController.updateUser) {
  router.put("/:id", authenticateJWT, requireAdmin, usersController.updateUser);
}

export default router;
