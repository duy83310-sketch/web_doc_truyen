import _db from '../models/index.js';
const db = _db.default ? _db.default : _db;
const { Reading_History, Stories, Chapters } = db;

export async function addOrUpdateReadingHistory(req, res) {
  try {
    const user_id = req.user.user_id;
    const { story_id, last_chapter_read_id } = req.body;

    const [rec, created] = await Reading_History.findOrCreate({
      where: { user_id, story_id },
      defaults: { last_chapter_read_id, last_read_at: new Date() }
    });

    if (!created) {
      rec.last_chapter_read_id = last_chapter_read_id;
      rec.last_read_at = new Date();
      await rec.save();
    }

    res.json(rec);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getReadingHistoryByUser(req, res) {
  try {
    const uid = req.params.userId || req.user.user_id;

    const list = await Reading_History.findAll({
      where: { user_id: uid },
      include: [
        { model: Stories },
        { model: Chapters }
      ]
    });

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getReadingRecord(req, res) {
  try {
    const { user_id, story_id } = req.query;
    const rec = await Reading_History.findOne({ where: { user_id, story_id } });
    res.json(rec);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function deleteReadingHistory(req, res) {
  try {
    const user_id = req.user.user_id;
    const { story_id } = req.body;

    const deleted = await Reading_History.destroy({
      where: { user_id, story_id }
    });

    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
