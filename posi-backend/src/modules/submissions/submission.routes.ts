// src/modules/submissions/submission.routes.ts
import { Router } from 'express';
import { SubmissionController } from './submission.controller.js';
import { authenticateJWT, authorizeRoles } from '../auth/auth.middleware.js';

const router = Router();

router.post('/', authenticateJWT, SubmissionController.create);
router.get('/', authenticateJWT, authorizeRoles('ADMIN'), SubmissionController.getAll);
router.get('/:id', authenticateJWT, authorizeRoles('ADMIN'), SubmissionController.getById);
router.get('/user/:userId', authenticateJWT, SubmissionController.getByUser);
router.put('/:id', authenticateJWT, authorizeRoles('ADMIN'), SubmissionController.updateStatus);
router.delete('/:id', authenticateJWT, authorizeRoles('ADMIN'), SubmissionController.delete);

export default router;
