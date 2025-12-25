// // controllers/favorites.controller.js
// const db = require('../models');
// const { Favorites, Stories } = db;

// module.exports = {
//   addFavorite: async (req, res) => {
//     try {
//       const user_id = req.user.user_id;
//       const { story_id } = req.body;
//       await Favorites.findOrCreate({ where: { user_id, story_id }, defaults: { added_at: new Date() } });
//       res.json({ success: true });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   removeFavorite: async (req, res) => {
//     try {
//       const user_id = req.user.user_id;
//       const { story_id } = req.body;
//       await Favorites.destroy({ where: { user_id, story_id } });
//       res.json({ success: true });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   getFavoritesByUser: async (req, res) => {
//     try {
//       const { userId } = req.params;
//       // if userId omitted, use current user
//       const uid = userId || req.user.user_id;
//       const favs = await Favorites.findAll({ where: { user_id: uid }, include: [{ model: Stories }] });
//       res.json(favs.map(f => f.Story || f));
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   }
// };
// controllers/favoritescontroller.js
import _db from '../models/index.js';
const db = _db.default ? _db.default : _db;
const { Favorites, Stories } = db;

export async function addFavorite(req, res) {
  try {
    const user_id = req.user.user_id;
    const { story_id } = req.body;
    await Favorites.findOrCreate({ where: { user_id, story_id }, defaults: { added_at: new Date() } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function removeFavorite(req, res) {
  try {
    const user_id = req.user.user_id;
    const { story_id } = req.body;
    await Favorites.destroy({ where: { user_id, story_id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getFavoritesByUser(req, res) {
  try {
    const { userId } = req.params;
    const uid = userId || req.user.user_id;
    const favs = await Favorites.findAll({ where: { user_id: uid }, include: [{ model: Stories }] });
    // map to story objects if available
    const mapped = favs.map(f => f.Story || f);
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
