import _db from "../models/index.js";
const db = _db.default ? _db.default : _db;
const { Stories, Genres, Story_Genres, Chapters, Ratings } = db;
const Sequelize = db.Sequelize;

export async function createStory(req, res) {
  try {
    // 1. Check quyền Admin
    if (!req.user?.is_admin)
      return res.status(403).json({ error: "Chỉ Admin mới được thêm truyện" });

    // 2. Lấy dữ liệu từ Form
    const { title, author, summary, status, genre_ids } = req.body;
    let cover_image_url = null;

    // 3. Xử lý file ảnh nếu có
    if (req.file) {
      const protocol = req.protocol;
      const host = req.get("host");
      // Tạo URL đầy đủ: http://localhost:3000/uploads/filename.jpg
      cover_image_url = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    // 4. Tạo truyện trong DB
    const story = await Stories.create({
      title,
      author,
      summary,
      status,
      cover_image_url,
      created_by_user_id: req.user.user_id,
    });

    // 5. Lưu thể loại (Genres)
    if (genre_ids) {
      // Vì gửi qua FormData, genre_ids có thể là mảng hoặc 1 giá trị đơn lẻ
      const gIds = Array.isArray(genre_ids) ? genre_ids : [genre_ids];
      await Promise.all(
        gIds.map((gid) =>
          Story_Genres.create({ story_id: story.story_id, genre_id: gid })
        )
      );
    }

    res.status(201).json(story);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server khi tạo truyện" });
  }
}

export async function updateStory(req, res) {
  try {
    const { id } = req.params;
    const story = await Stories.findByPk(id);
    if (!story) return res.status(404).json({ error: "Không tìm thấy truyện" });

    // Check quyền (Admin hoặc chủ sở hữu)
    if (!req.user?.is_admin && req.user.user_id !== story.created_by_user_id) {
      return res.status(403).json({ error: "Không có quyền sửa truyện này" });
    }

    const updateData = { ...req.body };

    // Nếu upload ảnh mới thì cập nhật URL, nếu không thì giữ nguyên ảnh cũ
    if (req.file) {
      const protocol = req.protocol;
      const host = req.get("host");
      updateData.cover_image_url = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    await Stories.update(updateData, { where: { story_id: id } });
    res.json({ success: true, message: "Cập nhật thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server khi sửa truyện" });
  }
}

export async function getAllStories(req, res) {
  try {
    // Lấy tham số phân trang từ URL (mặc định trang 1, 10 truyện/trang)
    const { q, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Điều kiện tìm kiếm theo tên
    const whereCondition = q
      ? { title: { [Sequelize.Op.like]: `%${q}%` } }
      : {};

    // Query DB với limit/offset
    const { count, rows } = await Stories.findAndCountAll({
      where: whereCondition,
      include: [{ model: Genres, as: "genres", through: { attributes: [] } }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true, // Đếm chính xác khi join bảng
      order: [["story_id", "DESC"]], // Truyện mới nhất lên đầu
    });

    // Trả về dữ liệu chuẩn cấu trúc phân trang
    res.json({
      data: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách truyện" });
  }
}

// Giữ nguyên các hàm khác không đổi
export async function deleteStory(req, res) {
  try {
    const { id } = req.params;
    const story = await Stories.findByPk(id);
    if (!story) return res.status(404).json({ error: "Not found" });
    if (!req.user?.is_admin && req.user.user_id !== story.created_by_user_id)
      return res.status(403).json({ error: "Forbidden" });
    await Stories.destroy({ where: { story_id: id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getStoryById(req, res) {
  try {
    const { id } = req.params;
    const story = await Stories.findByPk(id, {
      include: [
        { model: Genres, as: "genres", through: { attributes: [] } },
        { model: Chapters },
        {
          model: Ratings,
          attributes: ["score", "comment", "user_id", "rated_at"],
        },
      ],
    });
    if (!story) return res.status(404).json({ error: "Not found" });
    res.json(story);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function searchStories(req, res) {
  return getAllStories(req, res);
}

export async function getStoriesByUser(req, res) {
  try {
    const { userId } = req.params;
    const list = await Stories.findAll({
      where: { created_by_user_id: userId },
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
