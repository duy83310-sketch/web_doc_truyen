// // controllers/stories.controller.js
// const db = require('../models');
// const { Stories, Genres, Story_Genres, Chapters, Ratings } = db;
// const Sequelize = db.Sequelize;

// module.exports = {
//   createStory: async (req, res) => {
//     try {
//       // only admin (or allow users depending on your policy)
//       if (!req.user?.is_admin) return res.status(403).json({ error: 'Only admin can create stories' });
//       const data = req.body;
//       data.created_by_user_id = req.user.user_id;
//       const story = await Stories.create(data);
//       // optional: attach genres if provided
//       if (data.genre_ids && Array.isArray(data.genre_ids)) {
//         await Promise.all(data.genre_ids.map(gid => Story_Genres.create({ story_id: story.story_id, genre_id: gid })));
//       }
//       res.status(201).json(story);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   updateStory: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const story = await Stories.findByPk(id);
//       if (!story) return res.status(404).json({ error: 'Not found' });
//       // allow only admin or creator
//       if (!req.user?.is_admin && req.user.user_id !== story.created_by_user_id) return res.status(403).json({ error: 'Forbidden' });

//       await Stories.update(req.body, { where: { story_id: id } });
//       const updated = await Stories.findByPk(id);
//       res.json(updated);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   deleteStory: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const story = await Stories.findByPk(id);
//       if (!story) return res.status(404).json({ error: 'Not found' });
//       if (!req.user?.is_admin && req.user.user_id !== story.created_by_user_id) return res.status(403).json({ error: 'Forbidden' });
//       await Stories.destroy({ where: { story_id: id } });
//       res.json({ success: true });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   getStoryById: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const story = await Stories.findByPk(id, {
//         include: [
//           { model: Genres, as: 'genres', through: { attributes: [] } },
//           { model: Chapters },
//           { model: Ratings, attributes: ['score', 'comment', 'user_id', 'rated_at'] }
//         ]
//       });
//       if (!story) return res.status(404).json({ error: 'Not found' });
//       res.json(story);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   getAllStories: async (req, res) => {
//     try {
//       const q = req.query.q || '';
//       const stories = await Stories.findAll({
//         where: q ? { title: { [Sequelize.Op.like]: `%${q}%` } } : undefined,
//         include: [{ model: Genres, as: 'genres', through: { attributes: [] } }]
//       });
//       res.json(stories);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   searchStories: async (req, res) => {
//     // alias of getAllStories with more filters
//     return module.exports.getAllStories(req, res);
//   }
// };
// controllers/storiescontroller.js
import _db from '../models/index.js';
const db = _db.default ? _db.default : _db;
const { Stories, Genres, Story_Genres, Chapters, Ratings } = db;
const Sequelize = db.Sequelize;

export async function createStory(req, res) {
  try {
    if (!req.user?.is_admin) return res.status(403).json({ error: 'Only admin can create stories' });
    const data = req.body;
    data.created_by_user_id = req.user.user_id;
    const story = await Stories.create(data);
    if (data.genre_ids && Array.isArray(data.genre_ids)) {
      await Promise.all(data.genre_ids.map(gid => Story_Genres.create({ story_id: story.story_id, genre_id: gid })));
    }
    res.status(201).json(story);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function updateStory(req, res) {
  try {
    const { id } = req.params;
    const story = await Stories.findByPk(id);
    if (!story) return res.status(404).json({ error: 'Not found' });
    if (!req.user?.is_admin && req.user.user_id !== story.created_by_user_id) return res.status(403).json({ error: 'Forbidden' });
    await Stories.update(req.body, { where: { story_id: id } });
    const updated = await Stories.findByPk(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function deleteStory(req, res) {
  try {
    const { id } = req.params;
    const story = await Stories.findByPk(id);
    if (!story) return res.status(404).json({ error: 'Not found' });
    if (!req.user?.is_admin && req.user.user_id !== story.created_by_user_id) return res.status(403).json({ error: 'Forbidden' });
    await Stories.destroy({ where: { story_id: id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getStoryById(req, res) {
  try {
    const { id } = req.params;
    const story = await Stories.findByPk(id, {
      include: [
        { model: Genres, as: 'genres', through: { attributes: [] } },
        { model: Chapters },
        { model: Ratings, attributes: ['score', 'comment', 'user_id', 'rated_at'] }
      ]
    });
    if (!story) return res.status(404).json({ error: 'Not found' });
    res.json(story);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getAllStories(req, res) {
  try {
    const q = req.query.q || '';
    const stories = await Stories.findAll({
      where: q ? { title: { [Sequelize.Op.like]: `%${q}%` } } : undefined,
      include: [{ model: Genres, as: 'genres', through: { attributes: [] } }]
    });
    res.json(stories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function searchStories(req, res) {
  return getAllStories(req, res);
}

export async function getStoriesByUser(req, res) {
  try {
    const { userId } = req.params;
    const list = await Stories.findAll({ where: { created_by_user_id: userId } });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
