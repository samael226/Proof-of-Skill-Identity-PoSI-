import { Router } from "express";
import { AdminSubmissionController } from "../controllers/adminSubmission.controller.js";
import { requireAuth } from "../modules/auth/auth.middleware.js";
import { requireAdmin } from "../modules/auth/role.middleware.js";

const router = Router();

router.get(
  "/admin/submissions/pending",
  requireAuth,
  requireAdmin,
  AdminSubmissionController.getPending
);

router.post(
  "/admin/submissions/:id/review",
  requireAuth,
  requireAdmin,
  AdminSubmissionController.review
);

export default router;

