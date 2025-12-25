// routes/auth.routes.js
import express from 'express';
import * as authController from '../controllers/authcontroller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();
console.log(">>> auth.routers loaded");;
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me',authenticateJWT, authController.getProfile); // note: controller checks auth via middleware usually; if you want protect, add authenticateJWT in AppRouter mount
router.get("/login", (req, res) => {
  res.json({ message: "Login endpoint requires POST" });
});

export default router;
