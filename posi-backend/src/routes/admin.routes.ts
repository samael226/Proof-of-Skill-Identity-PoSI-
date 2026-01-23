// src/routes/admin.routes.ts
import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../modules/auth/auth.middleware.js';


const router = Router();

router.get('/dashboard', authenticateJWT, authorizeRoles('ADMIN'), (req, res) => {
  res.json({ message: 'Welcome Admin!', user: req.user });
});


export default router;
