// routes/chapter.routes.js
import express from 'express';
import * as chaptersController from '../controllers/chapterscontroller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();
console.log(">>> chapter.router loaded");;
// Public
router.get('/story/:storyId', chaptersController.getChaptersByStoryId);
router.get('/:id', chaptersController.getChapterById);

// Protected (create/update/delete)
router.post('/', authenticateJWT, chaptersController.createChapter); // admin or owner (controller checks)
router.put('/:id', authenticateJWT, chaptersController.updateChapter);
router.delete('/:id', authenticateJWT, chaptersController.deleteChapter);
export default router;
