import _db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const db = _db.default ? _db.default : _db;
const { Users } = db;
const JWT_SECRET = process.env.JWT_SECRET || "change_this";

export async function register(req, res) {
  try {
    const { username, email, password, full_name } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });

    const existing = await Users.findOne({ where: { username } });
    if (existing) return res.status(409).json({ error: "Username đã tồn tại" });

    const hash = await bcrypt.hash(password, 10);

    // Mặc định tạo ra là is_admin: false
    const user = await Users.create({
      username,
      email,
      password_hash: hash,
      full_name,
      is_admin: false,
    });

    const token = jwt.sign(
      { user_id: user.user_id, is_admin: user.is_admin },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // QUAN TRỌNG: Phải trả về is_admin để frontend biết đường lưu
    res.status(201).json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin, // <--- Dòng này quan trọng
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function login(req, res) {
  try {
    const { usernameOrEmail, password } = req.body;
    const user = await Users.findOne({
      where: db.Sequelize.or(
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ),
    });

    if (!user)
      return res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu" });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ error: "Sai tài khoản hoặc mật khẩu" });

    // Tạo token chứa quyền admin
    const token = jwt.sign(
      { user_id: user.user_id, is_admin: user.is_admin },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // QUAN TRỌNG: Trả về đầy đủ thông tin User bao gồm is_admin
    res.json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        is_admin: user.is_admin, // <--- CẦN PHẢI CÓ DÒNG NÀY thì AdminRoute mới cho qua
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getProfile(req, res) {
  try {
    // Lấy thông tin user hiện tại từ DB (trừ pass)
    const user = await Users.findByPk(req.user.user_id, {
      attributes: { exclude: ["password_hash"] },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Trả về user object (Sequelize tự trả về đúng các trường, bao gồm is_admin)
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
