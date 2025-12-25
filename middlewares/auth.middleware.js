// // // middlewares/auth.middleware.js
// // const jwt = require('jsonwebtoken');
// // const JWT_SECRET = process.env.JWT_SECRET || 'change_this'; // đổi trong .env
// // const db = require('../models');

// // // verify token and attach req.user
// // function authenticateJWT(req, res, next) {
// //   const authHeader = req.headers.authorization || '';
// //   const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
// //   if (!token) return res.status(401).json({ error: 'Unauthorized: token missing' });

// //   try {
// //     const payload = jwt.verify(token, JWT_SECRET);
// //     req.user = { user_id: payload.user_id, is_admin: payload.is_admin };
// //     return next();
// //   } catch (err) {
// //     return res.status(401).json({ error: 'Unauthorized: invalid token' });
// //   }
// // }

// // // require admin
// // function requireAdmin(req, res, next) {
// //   if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
// //   if (!req.user.is_admin) return res.status(403).json({ error: 'Forbidden: admin only' });
// //   return next();
// // }

// // // optional helper to check resource owner or admin
// // function requireOwnerOrAdmin(getOwnerId) {
// //   return async (req, res, next) => {
// //     try {
// //       const ownerId = await getOwnerId(req); // function should return owner id
// //       if (req.user?.is_admin || Number(req.user?.user_id) === Number(ownerId)) return next();
// //       return res.status(403).json({ error: 'Forbidden' });
// //     } catch (err) {
// //       next(err);
// //     }
// //   };
// // }

// // module.exports = {
// //   authenticateJWT,
// //   requireAdmin,
// //   requireOwnerOrAdmin
// // };
// // middlewares/auth.middleware.js
// const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET || 'change_this'; // đổi trong .env
// const db = require('../models');

// // verify token and attach req.user
// function authenticateJWT(req, res, next) {
//   const authHeader = req.headers.authorization || '';
//   const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
//   if (!token) return res.status(401).json({ error: 'Unauthorized: token missing' });

//   try {
//     const payload = jwt.verify(token, JWT_SECRET);
//     req.user = { user_id: payload.user_id, is_admin: payload.is_admin };
//     return next();
//   } catch (err) {
//     return res.status(401).json({ error: 'Unauthorized: invalid token' });
//   }
// }

// // require admin
// function requireAdmin(req, res, next) {
//   if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
//   if (!req.user.is_admin) return res.status(403).json({ error: 'Forbidden: admin only' });
//   return next();
// }

// // optional helper to check resource owner or admin
// function requireOwnerOrAdmin(getOwnerId) {
//   return async (req, res, next) => {
//     try {
//       const ownerId = await getOwnerId(req); // function should return owner id
//       if (req.user?.is_admin || Number(req.user?.user_id) === Number(ownerId)) return next();
//       return res.status(403).json({ error: 'Forbidden' });
//     } catch (err) {
//       next(err);
//     }
//   };
// }

// module.exports = {
//   authenticateJWT,
//   requireAdmin,
//   requireOwnerOrAdmin
// };
// middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this';

// verify token and attach req.user
export function authenticateJWT(req, res, next) {
  console.log('AUTH HEADER:', req.headers.authorization);

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized: token missing' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { user_id: payload.user_id, is_admin: payload.is_admin };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: invalid token' });
  }
}

// require admin
export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (!req.user.is_admin) return res.status(403).json({ error: 'Forbidden: admin only' });
  return next();
}

// optional helper to check resource owner or admin
export function requireOwnerOrAdmin(getOwnerId) {
  return async (req, res, next) => {
    try {
      const ownerId = await getOwnerId(req); // function should return owner id
      if (req.user?.is_admin || Number(req.user?.user_id) === Number(ownerId)) return next();
      return res.status(403).json({ error: 'Forbidden' });
    } catch (err) {
      next(err);
    }
  };
}
