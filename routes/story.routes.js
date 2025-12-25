// routes/story.routes.js
import express from 'express';
import * as storiesController from '../controllers/storiescontroller.js';
import { authenticateJWT, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();
console.log(">>> story.router loaded");;
// Public
router.get('/', storiesController.getAllStories);
router.get('/search', storiesController.searchStories);
router.get('/:id', storiesController.getStoryById);

// Story management
router.post('/', authenticateJWT, requireAdmin, storiesController.createStory); // admin-only (change if you want users able to create)
router.put('/:id', authenticateJWT, storiesController.updateStory); // owner or admin (controller checks)
router.delete('/:id', authenticateJWT, storiesController.deleteStory);

// Extra: list stories by user
router.get('/user/:userId', storiesController.getStoriesByUser);

export default router;
