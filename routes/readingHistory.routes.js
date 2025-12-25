// routes/readingHistory.routes.js
import express from 'express';
import * as readingHistoryController from '../controllers/readingHistorycontroller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();
console.log(">>> readingHistory.router loaded");;
// Add or update reading history (upsert per user/story)
router.post('/', authenticateJWT, readingHistoryController.addOrUpdateReadingHistory);

// Get history for a user (or current user)
router.get('/user/:userId', authenticateJWT, readingHistoryController.getReadingHistoryByUser);
router.get('/me', authenticateJWT, (req, res, next) => readingHistoryController.getReadingHistoryByUser({ params: { userId: req.user.user_id }, user: req.user }, res, next));

// Get single record (by query)
router.get('/', authenticateJWT, readingHistoryController.getReadingRecord);

// Delete record
router.delete('/:id', authenticateJWT, readingHistoryController.deleteReadingHistory);

export default router;
 