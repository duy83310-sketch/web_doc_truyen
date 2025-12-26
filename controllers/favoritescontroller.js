import _db from "../models/index.js";
const db = _db.default ? _db.default : _db;
const { Favorites, Stories, Chapters } = db;

export async function addFavorite(req, res) {
  try {
    const user_id = req.user.user_id;
    const { story_id } = req.body;

    // Tìm hoặc tạo (tránh trùng lặp)
    const [fav, created] = await Favorites.findOrCreate({
      where: { user_id, story_id },
      defaults: { added_at: new Date() },
    });

    if (!created)
      return res.status(200).json({ message: "Truyện đã có trong tủ" });
    res.status(201).json(fav);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function removeFavorite(req, res) {
  try {
    const user_id = req.user.user_id;
    const { story_id } = req.body; // Lấy từ body (axios.delete gửi data: { story_id })

    await Favorites.destroy({ where: { user_id, story_id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getFavoritesByUser(req, res) {
  try {
    const user_id = req.user.user_id;
    const list = await Favorites.findAll({
      where: { user_id },
      order: [["added_at", "DESC"]],
      // QUAN TRỌNG: Include Stories để lấy thông tin hiển thị ra trang web
      include: [
        {
          model: Stories,
          attributes: [
            "story_id",
            "title",
            "cover_image_url",
            "author",
            "status",
            "rating_average",
          ], // Lấy các trường cần thiết
        },
      ],
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// Hàm kiểm tra xem user đã thích truyện này chưa (dùng cho StoryDetail)
export async function checkFavorite(req, res) {
  try {
    const user_id = req.user.user_id;
    // API này trả về list favorites ID của user để frontend check
    const list = await Favorites.findAll({
      where: { user_id },
      attributes: ["story_id"],
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
