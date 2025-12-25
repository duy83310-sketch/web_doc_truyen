// // controllers/chapters.controller.js
// const db = require('../models');
// const { Chapters, Stories } = db;

// module.exports = {
//   createChapter: async (req, res) => {
//     try {
//       const { story_id } = req.body;
//       const story = await Stories.findByPk(story_id);
//       if (!story) return res.status(404).json({ error: 'Story not found' });
//       // only admin or creator
//       if (!req.user.is_admin && req.user.user_id !== story.created_by_user_id) return res.status(403).json({ error: 'Forbidden' });

//       const chapter = await Chapters.create(req.body);
//       res.status(201).json(chapter);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   updateChapter: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const chap = await Chapters.findByPk(id);
//       if (!chap) return res.status(404).json({ error: 'Not found' });
//       // check permission: need to load story
//       const story = await Stories.findByPk(chap.story_id);
//       if (!req.user.is_admin && req.user.user_id !== story.created_by_user_id) return res.status(403).json({ error: 'Forbidden' });
//       await Chapters.update(req.body, { where: { chapter_id: id } });
//       const updated = await Chapters.findByPk(id);
//       res.json(updated);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   deleteChapter: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const chap = await Chapters.findByPk(id);
//       if (!chap) return res.status(404).json({ error: 'Not found' });
//       const story = await Stories.findByPk(chap.story_id);
//       if (!req.user.is_admin && req.user.user_id !== story.created_by_user_id) return res.status(403).json({ error: 'Forbidden' });
//       await Chapters.destroy({ where: { chapter_id: id } });
//       res.json({ success: true });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   getChaptersByStoryId: async (req, res) => {
//     try {
//       const { storyId } = req.params;
//       const chapters = await Chapters.findAll({ where: { story_id: storyId }, order: [['chapter_number', 'ASC']] });
//       res.json(chapters);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   getChapterById: async (req, res) => {
//     try {
//       const { id } = req.params;
//       const chapter = await Chapters.findByPk(id);
//       if (!chapter) return res.status(404).json({ error: 'Not found' });
//       res.json(chapter);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   }
// };
// controllers/chapterscontroller.js
import _db from '../models/index.js';
const db = _db.default ? _db.default : _db;
const { Chapters, Stories } = db;

export async function createChapter(req, res) {
  try {
    const { story_id } = req.body;
    const story = await Stories.findByPk(story_id);
    if (!story) return res.status(404).json({ error: 'Story not found' });
    if (!req.user.is_admin && req.user.user_id !== story.created_by_user_id) return res.status(403).json({ error: 'Forbidden' });

    const chapter = await Chapters.create(req.body);
    res.status(201).json(chapter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function updateChapter(req, res) {
  try {
    const { id } = req.params;
    const chap = await Chapters.findByPk(id);
    if (!chap) return res.status(404).json({ error: 'Not found' });
    const story = await Stories.findByPk(chap.story_id);
    if (!req.user.is_admin && req.user.user_id !== story.created_by_user_id) return res.status(403).json({ error: 'Forbidden' });
    await Chapters.update(req.body, { where: { chapter_id: id } });
    const updated = await Chapters.findByPk(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function deleteChapter(req, res) {
  try {
    const { id } = req.params;
    const chap = await Chapters.findByPk(id);
    if (!chap) return res.status(404).json({ error: 'Not found' });
    const story = await Stories.findByPk(chap.story_id);
    if (!req.user.is_admin && req.user.user_id !== story.created_by_user_id) return res.status(403).json({ error: 'Forbidden' });
    await Chapters.destroy({ where: { chapter_id: id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getChaptersByStoryId(req, res) {
  try {
    console.log('>>> GET chapters by story', req.params.storyId);
    const { storyId } = req.params;
    const chapters = await Chapters.findAll({ where: { story_id: storyId }, order: [['chapter_number', 'ASC']] });
    res.json(chapters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getChapterById(req, res) {
  try {
    const { id } = req.params;
    const chapter = await Chapters.findByPk(id);
    if (!chapter) return res.status(404).json({ error: 'Not found' });
    res.json(chapter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
