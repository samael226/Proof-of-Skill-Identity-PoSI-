// src/routes/admin.routes.ts
import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../modules/auth/auth.middleware.js';
import { AdminSubmissionController } from "../modules/admin/admin.submission.controller.js";


const router = Router();

router.get('/dashboard', authenticateJWT, authorizeRoles('ADMIN'), (req, res) => {
  res.json({ message: 'Welcome Admin!', user: req.user });
});
router.use(authenticateJWT, authorizeRoles("ADMIN"));
router.get("/dashboard/stats", AdminSubmissionController.stats);
router.get("/submissions", AdminSubmissionController.list);
router.get("/submissions/:id", AdminSubmissionController.getOne);
router.patch("/submissions/:id/review", AdminSubmissionController.review);

export default router;
