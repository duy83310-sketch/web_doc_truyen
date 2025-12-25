// // controllers/auth.controller.js
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const db = require('../models');
// const { Users } = db;

// const JWT_SECRET = process.env.JWT_SECRET || 'change_this'; // set env in prod
// const SALT_ROUNDS = 10;

// module.exports = {
//   register: async (req, res) => {
//     try {
//       const { username, email, password, full_name } = req.body;
//       if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });

//       const existing = await Users.findOne({ where: { [db.Sequelize.Op.or]: [{ username }, { email }] } });
//       if (existing) return res.status(409).json({ error: 'Username or email already exists' });

//       const hash = await bcrypt.hash(password, SALT_ROUNDS);
//       const user = await Users.create({ username, email, password_hash: hash, full_name });

//       const token = jwt.sign({ user_id: user.user_id, is_admin: user.is_admin }, JWT_SECRET, { expiresIn: '7d' });
//       res.status(201).json({ user: { user_id: user.user_id, username: user.username, email: user.email }, token });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   login: async (req, res) => {
//     try {
//       const { usernameOrEmail, password } = req.body;
//       if (!usernameOrEmail || !password) return res.status(400).json({ error: 'Missing fields' });

//       const user = await Users.findOne({
//         where: db.Sequelize.where(
//           db.Sequelize.fn('LOWER', db.Sequelize.col('username')),
//           usernameOrEmail.toLowerCase()
//         )
//       }) || await Users.findOne({ where: { email: usernameOrEmail } });

//       // try by username or email
//       let found = user;
//       if (!found) {
//         found = await Users.findOne({
//           where: {
//             [db.Sequelize.Op.or]: [
//               { username: usernameOrEmail },
//               { email: usernameOrEmail }
//             ]
//           }
//         });
//       }

//       if (!found) return res.status(401).json({ error: 'Invalid credentials' });

//       const match = await bcrypt.compare(password, found.password_hash);
//       if (!match) return res.status(401).json({ error: 'Invalid credentials' });

//       const token = jwt.sign({ user_id: found.user_id, is_admin: found.is_admin }, JWT_SECRET, { expiresIn: '7d' });
//       res.json({ token, user: { user_id: found.user_id, username: found.username, email: found.email } });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   getProfile: async (req, res) => {
//     try {
//       const uid = req.user?.user_id;
//       if (!uid) return res.status(401).json({ error: 'Unauthorized' });

//       const user = await Users.findByPk(uid, { attributes: { exclude: ['password_hash'] } });
//       if (!user) return res.status(404).json({ error: 'Not found' });
//       res.json(user);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   }
// };


// controllers/authcontroller.js
import _db from '../models/index.js';
const db = _db.default ? _db.default : _db;
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { Users } = db;
const JWT_SECRET = process.env.JWT_SECRET || 'change_this';
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

export async function register(req, res) {
  try {
    const { username, email, password, full_name } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    const existing = await Users.findOne({
      where: db.Sequelize.or({ username }, { email })
    });
    if (existing) return res.status(409).json({ error: 'Username or email already exists' });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await Users.create({ username, email, password_hash: hash, full_name });

    const token = jwt.sign({ user_id: user.user_id, is_admin: user.is_admin }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.status(201).json({ user: { user_id: user.user_id, username: user.username, email: user.email }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function login(req, res) {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) return res.status(400).json({ error: 'Missing fields' });

    const found = await Users.findOne({
      where: db.Sequelize.or({ username: usernameOrEmail }, { email: usernameOrEmail })
    });

    if (!found) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, found.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ user_id: found.user_id, is_admin: found.is_admin }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({ token, user: { user_id: found.user_id, username: found.username, email: found.email } });
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
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
