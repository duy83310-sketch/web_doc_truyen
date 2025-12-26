import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import AppRouter from "./routes/AppRouter.js";

dotenv.config();

// Cấu hình đường dẫn cho ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tạo thư mục uploads nếu chưa có (để tránh lỗi khi start)
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Bảo mật HTTP headers (Cho phép load ảnh từ cùng domain)
app.use(helmet({ crossOriginResourcePolicy: false }));

// 2. Cấu hình CORS (Cho phép Frontend gọi API)
app.use(
  cors({
    origin: true, // Cho phép tất cả hoặc set cụ thể 'http://localhost:5173'
    credentials: true,
  })
);

// 3. Parser dữ liệu JSON và Form
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Public thư mục uploads (Để Frontend hiển thị được ảnh)
// Truy cập: http://localhost:3000/uploads/ten-anh.jpg
app.use("/uploads", express.static(uploadDir));

// 5. Khởi tạo Routes
AppRouter(app);

// 6. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📂 Thư mục upload: ${uploadDir}`);
});
