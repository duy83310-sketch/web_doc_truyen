// routes/user.routes.js
import express from 'express';
import * as usersController from '../controllers/userscontroller.js';
import { authenticateJWT, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router()
console.log(">>> user.routes loaded");;

// Public (or secured) endpoints
router.get('/', authenticateJWT, requireAdmin, usersController.getAllUsers); // admin: list users
router.get('/me', authenticateJWT, usersController.getProfile); // current user
router.get('/:id', authenticateJWT, usersController.getUserById);

// Admin / owner actions
router.put('/:id', authenticateJWT, usersController.updateUser); // owner or admin
router.delete('/:id', authenticateJWT, usersController.deleteUser); // owner or admin

export default router;
