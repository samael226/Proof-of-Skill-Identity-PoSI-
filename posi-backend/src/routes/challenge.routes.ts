// src/routes/challenge.routes.ts
import { Router } from 'express';
import { authenticateJWT } from '../modules/auth/auth.middleware.js';
import { authorizeRoles } from '../modules/auth/authorizeRoles.js';
import * as ChallengeController from '../modules/challenges/challenge.controller.js';

const router = Router();

// ADMIN-only
router.post(
  '/',
  authenticateJWT,
  authorizeRoles('ADMIN'),
  ChallengeController.create
);

router.put(
  '/:id',
  authenticateJWT,
  authorizeRoles('ADMIN'),
  ChallengeController.update
);

router.delete(
  '/:id',
  authenticateJWT,
  authorizeRoles('ADMIN'),
  ChallengeController.remove
);

// Anyone logged in can view
router.get('/', authenticateJWT, ChallengeController.getAll);
router.get('/:id', authenticateJWT, ChallengeController.getById);

export default router;
