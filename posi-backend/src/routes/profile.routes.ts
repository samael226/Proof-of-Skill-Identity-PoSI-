// src/routes/profile.routes.ts
import { Router } from 'express';
import { authenticateJWT } from '../modules/auth/auth.middleware.js';

const router = Router();

router.get('/me', authenticateJWT, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

export default router;
