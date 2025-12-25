// routes/favorite.routes.js
import express from 'express';
import * as favoritesController from '../controllers/favoritescontroller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();
console.log(">>> favorites.router loaded");;
// Add favorite (current logged-in user)
router.post('/', authenticateJWT, favoritesController.addFavorite);

// Remove favorite by story_id in body (or adjust to use /:storyId)
router.delete('/', authenticateJWT, favoritesController.removeFavorite);

// Get favorites of a user (if :userId omitted => current user)
router.get('/user/:userId', authenticateJWT, favoritesController.getFavoritesByUser);
router.get('/me', authenticateJWT, (req, res, next) => favoritesController.getFavoritesByUser({ params: { userId: req.user.user_id }, user: req.user }, res, next));

export default router;
