// routes/rating.routes.js
import express from 'express';
import * as ratingsController from '../controllers/ratingscontroller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();
console.log(">>> ratings.router loaded");;
// Add or update rating for a story (authenticated)
router.post('/', authenticateJWT, ratingsController.addRating);

// Update/delete specific rating by id
router.put('/:id', authenticateJWT, ratingsController.updateRating);
router.delete('/:id', authenticateJWT, ratingsController.deleteRating);

// Get ratings for a story and average
router.get('/story/:storyId', ratingsController.getRatingsByStoryId);
router.get('/story/:storyId/average', ratingsController.getAverageRatingForStory);

// Get current user's rating for a story
router.get('/me', authenticateJWT, ratingsController.getUserRatingForStory);

export default router;
