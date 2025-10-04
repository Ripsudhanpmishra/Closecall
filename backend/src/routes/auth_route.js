import express from 'express';
import { signup, login, logout, onboard } from '../controllers/auth_controller.js';
import { protectRoute } from '../middleware/auth_middleware.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.post('/onboarding', protectRoute, onboard);

//checks user is logged in
router.get('/me', protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
