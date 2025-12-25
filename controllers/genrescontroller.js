// // controllers/genres.controller.js
// const db = require('../models');
// const { Genres, Stories } = db;

// module.exports = {
//   createGenre: async (req, res) => {
//     try {
//       if (!req.user?.is_admin) return res.status(403).json({ error: 'Forbidden' });
//       const g = await Genres.create(req.body);
//       res.status(201).json(g);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   updateGenre: async (req, res) => {
//     try {
//       if (!req.user?.is_admin) return res.status(403).json({ error: 'Forbidden' });
//       const { id } = req.params;
//       await Genres.update(req.body, { where: { genre_id: id } });
//       const g = await Genres.findByPk(id);
//       res.json(g);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   deleteGenre: async (req, res) => {
//     try {
//       if (!req.user?.is_admin) return res.status(403).json({ error: 'Forbidden' });
//       const { id } = req.params;
//       await Genres.destroy({ where: { genre_id: id } });
//       res.json({ success: true });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   getAllGenres: async (req, res) => {
//     try {
//       const list = await Genres.findAll();
//       res.json(list);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   getStoriesByGenreId: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const genre = await Genres.findByPk(id, { include: [{ model: Stories, as: 'stories', through: { attributes: [] } }] });
//       if (!genre) return res.status(404).json({ error: 'Not found' });
//       res.json(genre.stories);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   }
// };
// controllers/genres.controller.js
import _db from '../models/index.js';
const db = _db.default ? _db.default : _db;
const { Genres, Stories } = db;

export async function createGenre(req, res) {
  try {
    if (!req.user?.is_admin) return res.status(403).json({ error: 'Forbidden' });
    const g = await Genres.create(req.body);
    res.status(201).json(g);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function updateGenre(req, res) {
  try {
    if (!req.user?.is_admin) return res.status(403).json({ error: 'Forbidden' });
    const { id } = req.params;
    await Genres.update(req.body, { where: { genre_id: id } });
    const g = await Genres.findByPk(id);
    res.json(g);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function deleteGenre(req, res) {
  try {
    if (!req.user?.is_admin) return res.status(403).json({ error: 'Forbidden' });
    const { id } = req.params;
    await Genres.destroy({ where: { genre_id: id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getAllGenres(req, res) {
  try {
    const list = await Genres.findAll();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getStoriesByGenreId(req, res) {
  try {
    const { id } = req.params;
    const genre = await Genres.findByPk(id, { include: [{ model: Stories, as: 'stories', through: { attributes: [] } }] });
    if (!genre) return res.status(404).json({ error: 'Not found' });
    res.json(genre.stories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
