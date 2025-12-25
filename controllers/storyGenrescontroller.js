// // controllers/storyGenres.controller.js
// const db = require('../models');
// const { Story_Genres } = db;

// module.exports = {
//   addGenreToStory: async (req, res) => {
//     try {
//       if (!req.user?.is_admin) return res.status(403).json({ error: 'Forbidden' });
//       const { story_id, genre_id } = req.body;
//       // Upsert: avoid duplicates
//       await Story_Genres.findOrCreate({ where: { story_id, genre_id } });
//       res.json({ success: true });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   removeGenreFromStory: async (req, res) => {
//     try {
//       if (!req.user?.is_admin) return res.status(403).json({ error: 'Forbidden' });
//       const { story_id, genre_id } = req.body;
//       await Story_Genres.destroy({ where: { story_id, genre_id } });
//       res.json({ success: true });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   getGenresForStory: async (req, res) => {
//     try {
//       const { storyId } = req.params;
//       const genres = await db.Genres.findAll({
//         include: [{
//           model: db.Story_Genres,
//           where: { story_id: storyId },
//           attributes: []
//         }]
//       });
//       res.json(genres);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   }
// };
// controllers/storyGenrescontroller.js
import _db from '../models/index.js';
const db = _db.default ? _db.default : _db;
const { Story_Genres } = db;

export async function addGenreToStory(req, res) {
  try {
    if (!req.user?.is_admin) return res.status(403).json({ error: 'Forbidden' });
    const { story_id, genre_id } = req.body;
    await Story_Genres.findOrCreate({ where: { story_id, genre_id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function removeGenreFromStory(req, res) {
  try {
    if (!req.user?.is_admin) return res.status(403).json({ error: 'Forbidden' });
    const { story_id, genre_id } = req.body;
    await Story_Genres.destroy({ where: { story_id, genre_id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getGenresForStory(req, res) {
  try {
    const { storyId } = req.params;
    const genres = await db.Genres.findAll({
      include: [{
        model: db.Story_Genres,
        where: { story_id: storyId },
        attributes: []
      }]
    });
    res.json(genres);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
