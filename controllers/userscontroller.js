// controllers/userscontroller.js
import _db from '../models/index.js';
const db = _db && _db.default ? _db.default : _db;
const { Users } = db;

export async function getAllUsers(req, res) {
  try {
    if (!req.user?.is_admin) return res.status(403).json({ error: 'Forbidden' });
    const users = await Users.findAll({ attributes: { exclude: ['password_hash'] } });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id, { attributes: { exclude: ['password_hash'] } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    if (Number(req.user.user_id) !== Number(id) && !req.user.is_admin) return res.status(403).json({ error: 'Forbidden' });
    const payload = { ...req.body };
    if (!req.user.is_admin) delete payload.is_admin;
    if (payload.password) delete payload.password;
    await Users.update(payload, { where: { user_id: id } });
    const updated = await Users.findByPk(id, { attributes: { exclude: ['password_hash'] } });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    if (!req.user.is_admin && Number(req.user.user_id) !== Number(id)) return res.status(403).json({ error: 'Forbidden' });
    await Users.destroy({ where: { user_id: id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getProfile(req, res) {
  try {
    const uid = req.user?.user_id;
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });
    const user = await Users.findByPk(uid, { attributes: { exclude: ['password_hash'] } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
