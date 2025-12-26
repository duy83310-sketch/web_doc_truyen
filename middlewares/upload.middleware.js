// // import multer from "multer";
// // import path from "path";

// // // Cấu hình nơi lưu và tên file
// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, "uploads/"); // Lưu vào thư mục uploads ở root
// //   },
// //   filename: (req, file, cb) => {
// //     // Đặt tên file: thời gian hiện tại - tên gốc (để tránh trùng)
// //     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
// //     cb(null, uniqueSuffix + path.extname(file.originalname));
// //   },
// // });

// // // Bộ lọc chỉ cho phép up ảnh
// // const fileFilter = (req, file, cb) => {
// //   if (file.mimetype.startsWith("image/")) {
// //     cb(null, true);
// //   } else {
// //     cb(new Error("Chỉ chấp nhận file định dạng ảnh!"), false);
// //   }
// // };

// // // Khởi tạo middleware upload
// // export const upload = multer({
// //   storage: storage,
// //   limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
// //   fileFilter: fileFilter,
// // });
// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Đảm bảo thư mục uploads tồn tại
// const uploadDir = path.join(process.cwd(), "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Cấu hình storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName =
//       "avatar_" + Date.now() + "_" + Math.round(Math.random() * 1e9) + ext;
//     cb(null, uniqueName);
//   },
// });

// // Filter chỉ cho upload ảnh
// const fileFilter = (req, file, cb) => {
//   if (!file.mimetype.startsWith("image/")) {
//     cb(new Error("Chỉ cho phép upload file ảnh"), false);
//   } else {
//     cb(null, true);
//   }
// };

// // Export multer
// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
// });
import multer from "multer";
import path from "path";
import fs from "fs";

// Lấy đường dẫn root project (nơi có server.js)
const uploadDir = path.join(process.cwd(), "uploads");

// Tạo thư mục uploads nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Cấu hình nơi lưu và tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // LUÔN đúng path
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename =
      "avatar_" + Date.now() + "_" + Math.round(Math.random() * 1e9) + ext;
    cb(null, filename);
  },
});

// Bộ lọc chỉ cho phép up ảnh
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Chỉ chấp nhận file định dạng ảnh!"), false);
  } else {
    cb(null, true);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});
