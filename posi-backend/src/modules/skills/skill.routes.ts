import { Router } from 'express';
import { SkillController } from './skill.controller.js';
import { authenticateJWT } from '../auth/auth.middleware.js';
import { authorizeRoles } from '../auth/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', SkillController.getAll);
router.get('/:id', SkillController.getById);

// Admin routes
router.post('/', authenticateJWT, authorizeRoles('ADMIN'), SkillController.create);
router.put('/:id', authenticateJWT, authorizeRoles('ADMIN'), SkillController.update);
router.delete('/:id', authenticateJWT, authorizeRoles('ADMIN'), SkillController.delete);

export default router;
