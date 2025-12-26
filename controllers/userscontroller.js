import _db from "../models/index.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

const db = _db && _db.default ? _db.default : _db;
const { Users } = db;

// 1. Cập nhật Profile (Sửa Username + Check trùng + Avatar)
export async function updateProfile(req, res) {
  try {
     console.log(req.file); 
    const userId = req.user.user_id;
    // Lấy username từ body để cho phép sửa
    const { full_name, phone_number, email, username } = req.body;

    const user = await Users.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // --- LOGIC CHECK TRÙNG USERNAME ---
    if (username && username !== user.username) {
      const exist = await Users.findOne({
        where: {
          username,
          user_id: { [Op.ne]: userId }, // Tìm user khác có cùng username này
        },
      });
      if (exist)
        return res.status(400).json({ error: "Username này đã được sử dụng" });

      user.username = username;
    }
    // ---------------------------------------

    user.full_name = full_name || user.full_name;
    user.phone_number = phone_number || user.phone_number;
    user.email = email || user.email;

    // Xử lý Avatar (nếu có file upload)
    if (req.file) {
      const protocol = req.protocol;
      const host = req.get("host");
      // Tạo đường dẫn ảnh đầy đủ
      user.avatar_url = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    await user.save();

    // Trả về user mới (đã loại bỏ password)
    const userData = user.toJSON();
    delete userData.password_hash;

    // userData lúc này mặc định sẽ có is_admin vì ta dùng toJSON() từ model instance đầy đủ
    res.json(userData);
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ error: "Lỗi server khi cập nhật profile" });
  }
}

// 2. Đổi mật khẩu
export async function changePassword(req, res) {
  try {
    const userId = req.user.user_id;
    const { current_password, new_password } = req.body;

    // Validate cơ bản
    if (!current_password || !new_password) {
      return res
        .status(400)
        .json({ error: "Vui lòng nhập mật khẩu cũ và mới" });
    }

    const user = await Users.findByPk(userId);

    // So sánh pass cũ
    const isMatch = await bcrypt.compare(current_password, user.password_hash);
    if (!isMatch)
      return res.status(400).json({ error: "Mật khẩu hiện tại không đúng" });

    // Hash pass mới
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(new_password, salt);
    await user.save();

    res.json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (err) {
    console.error("Change Pass Error:", err);
    res.status(500).json({ error: "Lỗi server: " + err.message });
  }
}

// 3. Lấy danh sách users (Admin only)
export async function getAllUsers(req, res) {
  try {
    if (!req.user?.is_admin)
      return res.status(403).json({ error: "Forbidden" });
    const users = await Users.findAll({
      attributes: { exclude: ["password_hash"] },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// 4. Lấy chi tiết user theo ID
export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id, {
      attributes: { exclude: ["password_hash"] },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// 5. Cập nhật user (Admin hoặc chính chủ - Generic Update)
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    // Chỉ Admin hoặc chính chủ mới được sửa
    if (Number(req.user.user_id) !== Number(id) && !req.user.is_admin)
      return res.status(403).json({ error: "Forbidden" });

    const payload = { ...req.body };

    // Ngăn user thường tự cấp quyền admin
    if (!req.user.is_admin) delete payload.is_admin;
    // Không cho sửa password qua API này (phải dùng changePassword)
    if (payload.password) delete payload.password;

    await Users.update(payload, { where: { user_id: id } });
    const updated = await Users.findByPk(id, {
      attributes: { exclude: ["password_hash"] },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// 6. Xóa user
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    if (!req.user.is_admin && Number(req.user.user_id) !== Number(id))
      return res.status(403).json({ error: "Forbidden" });
    await Users.destroy({ where: { user_id: id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// 7. Lấy profile bản thân
export async function getProfile(req, res) {
  try {
    const uid = req.user?.user_id;
    if (!uid) return res.status(401).json({ error: "Unauthorized" });
    const user = await Users.findByPk(uid, {
      attributes: { exclude: ["password_hash"] },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
