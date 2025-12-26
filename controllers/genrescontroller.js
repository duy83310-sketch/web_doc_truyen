import _db from "../models/index.js";
const db = _db.default ? _db.default : _db;
const { Genres } = db;

// 1. Lấy danh sách thể loại (Public - Ai cũng xem được để filter)
export async function getAllGenres(req, res) {
  try {
    const list = await Genres.findAll({
      order: [["name", "ASC"]], // Sắp xếp theo tên A-Z
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
}

// 2. Thêm thể loại (Admin)
export async function createGenre(req, res) {
  try {
    const { name, description } = req.body;
    if (!name)
      return res
        .status(400)
        .json({ error: "Tên thể loại không được để trống" });

    // Check trùng tên
    const exist = await Genres.findOne({ where: { name } });
    if (exist)
      return res.status(400).json({ error: "Thể loại này đã tồn tại" });

    const newGenre = await Genres.create({ name, description });
    res.status(201).json(newGenre);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
}

// 3. Sửa thể loại (Admin)
export async function updateGenre(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const genre = await Genres.findByPk(id);
    if (!genre)
      return res.status(404).json({ error: "Không tìm thấy thể loại" });

    genre.name = name || genre.name;
    genre.description = description || genre.description;

    await genre.save();
    res.json(genre);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
}

// 4. Xóa thể loại (Admin)
export async function deleteGenre(req, res) {
  try {
    const { id } = req.params;
    // Lưu ý: Nếu có bảng Story_Genres liên kết khóa ngoại, cần xử lý xóa ràng buộc trước
    // Hoặc để database tự xử lý (ON DELETE CASCADE)
    await Genres.destroy({ where: { genre_id: id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
}
