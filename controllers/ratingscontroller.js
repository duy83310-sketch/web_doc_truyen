// // controllers/ratings.controller.js
// const db = require('../models');
// const { Ratings, Stories } = db;
// const Sequelize = db.Sequelize;

// async function updateStoryStats(story_id) {
//   const stats = await Ratings.findAll({
//     where: { story_id },
//     attributes: [
//       [Sequelize.fn('AVG', Sequelize.col('score')), 'avg'],
//       [Sequelize.fn('COUNT', Sequelize.col('rating_id')), 'count']
//     ],
//     raw: true
//   });

//   const avg = parseFloat(stats[0].avg || 0).toFixed(2);
//   const count = parseInt(stats[0].count || 0, 10);
//   await Stories.update({ rating_average: avg, total_ratings: count }, { where: { story_id } });
// }

// module.exports = {
//   addRating: async (req, res) => {
//     try {
//       const user_id = req.user.user_id;
//       const { story_id, score, comment } = req.body;
//       // optional: prevent multiple ratings per user per story (upsert)
//       const [r, created] = await Ratings.findOrCreate({
//         where: { user_id, story_id },
//         defaults: { score, comment, rated_at: new Date() }
//       });
//       if (!created) {
//         // if exist update
//         r.score = score;
//         r.comment = comment;
//         r.rated_at = new Date();
//         await r.save();
//       }
//       await updateStoryStats(story_id);
//       res.json(r);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   updateRating: async (req, res) => {
//     try {
//       const { id } = req.params; // rating_id
//       const r = await Ratings.findByPk(id);
//       if (!r) return res.status(404).json({ error: 'Not found' });
//       if (r.user_id !== req.user.user_id && !req.user.is_admin) return res.status(403).json({ error: 'Forbidden' });
//       await Ratings.update(req.body, { where: { rating_id: id } });
//       const updated = await Ratings.findByPk(id);
//       await updateStoryStats(updated.story_id);
//       res.json(updated);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   deleteRating: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const r = await Ratings.findByPk(id);
//       if (!r) return res.status(404).json({ error: 'Not found' });
//       if (r.user_id !== req.user.user_id && !req.user.is_admin) return res.status(403).json({ error: 'Forbidden' });
//       await Ratings.destroy({ where: { rating_id: id } });
//       await updateStoryStats(r.story_id);
//       res.json({ success: true });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   getRatingsByStoryId: async (req, res) => {
//     try {
//       const { storyId } = req.params;
//       const list = await Ratings.findAll({ where: { story_id: storyId }, order: [['rated_at', 'DESC']] });
//       res.json(list);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   getUserRatingForStory: async (req, res) => {
//     try {
//       const user_id = req.user.user_id;
//       const { story_id } = req.query;
//       const r = await Ratings.findOne({ where: { user_id, story_id } });
//       res.json(r);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   getAverageRatingForStory: async (req, res) => {
//     try {
//       const { storyId } = req.params;
//       const stats = await Ratings.findAll({
//         where: { story_id: storyId },
//         attributes: [[Sequelize.fn('AVG', Sequelize.col('score')), 'avg'], [Sequelize.fn('COUNT', Sequelize.col('rating_id')), 'count']],
//         raw: true
//       });
//       res.json({ average: parseFloat(stats[0].avg || 0).toFixed(2), count: parseInt(stats[0].count || 0, 10) });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   }
// };
// controllers/ratingscontroller.js
import _db from "../models/index.js";
const db = _db.default ? _db.default : _db;
const { Ratings, Users, Stories } = db;
const Sequelize = db.Sequelize;

async function updateStoryStats(story_id) {
  const stats = await Ratings.findAll({
    where: { story_id },
    attributes: [
      [Sequelize.fn("AVG", Sequelize.col("score")), "avg"],
      [Sequelize.fn("COUNT", Sequelize.col("rating_id")), "count"],
    ],
    raw: true,
  });

  const avg = parseFloat(stats[0].avg || 0).toFixed(2);
  const count = parseInt(stats[0].count || 0, 10);
  await Stories.update(
    { rating_average: avg, total_ratings: count },
    { where: { story_id } }
  );
}

export async function addRating(req, res) {
  try {
    const user_id = req.user.user_id;
    const { story_id, score, comment } = req.body;
    const [r, created] = await Ratings.findOrCreate({
      where: { user_id, story_id },
      defaults: { score, comment, rated_at: new Date() },
    });
    if (!created) {
      r.score = score;
      r.comment = comment;
      r.rated_at = new Date();
      await r.save();
    }
    await updateStoryStats(story_id);
    res.json(r);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function updateRating(req, res) {
  try {
    const { id } = req.params;
    const r = await Ratings.findByPk(id);
    if (!r) return res.status(404).json({ error: "Not found" });
    if (r.user_id !== req.user.user_id && !req.user.is_admin)
      return res.status(403).json({ error: "Forbidden" });
    await Ratings.update(req.body, { where: { rating_id: id } });
    const updated = await Ratings.findByPk(id);
    await updateStoryStats(updated.story_id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function deleteRating(req, res) {
  try {
    const { id } = req.params;
    const r = await Ratings.findByPk(id);
    if (!r) return res.status(404).json({ error: "Not found" });
    if (r.user_id !== req.user.user_id && !req.user.is_admin)
      return res.status(403).json({ error: "Forbidden" });
    await Ratings.destroy({ where: { rating_id: id } });
    await updateStoryStats(r.story_id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getRatingsByStoryId(req, res) {
  try {
    const { storyId } = req.params;
    const list = await Ratings.findAll({
      where: { story_id: storyId },
      order: [["rated_at", "DESC"]],
      // QUAN TRỌNG: Include bảng Users để lấy tên và avatar người bình luận
      include: [
        {
          model: Users,
          attributes: ["user_id", "username", "avatar_url"],
        },
      ],
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getUserRatingForStory(req, res) {
  try {
    const user_id = req.user.user_id;
    const { story_id } = req.query;
    const r = await Ratings.findOne({ where: { user_id, story_id } });
    res.json(r);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getAverageRatingForStory(req, res) {
  try {
    const { storyId } = req.params;
    const stats = await Ratings.findAll({
      where: { story_id: storyId },
      attributes: [
        [Sequelize.fn("AVG", Sequelize.col("score")), "avg"],
        [Sequelize.fn("COUNT", Sequelize.col("rating_id")), "count"],
      ],
      raw: true,
    });
    res.json({
      average: parseFloat(stats[0].avg || 0).toFixed(2),
      count: parseInt(stats[0].count || 0, 10),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
