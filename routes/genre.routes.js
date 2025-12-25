// routes/genre.routes.js
import express from 'express';
import * as genresController from '../controllers/genrescontroller.js';
import { authenticateJWT, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();
console.log(">>> genre.routes  loaded");;
router.get('/', genresController.getAllGenres);
router.get('/:id/stories', genresController.getStoriesByGenreId);

// Admin only for CRUD
router.post('/', authenticateJWT, requireAdmin, genresController.createGenre);
router.put('/:id', authenticateJWT, requireAdmin, genresController.updateGenre);
router.delete('/:id', authenticateJWT, requireAdmin, genresController.deleteGenre);

export default router;
