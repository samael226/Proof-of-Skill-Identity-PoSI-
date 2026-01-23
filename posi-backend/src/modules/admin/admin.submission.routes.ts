import { Router } from "express";
import { AdminSubmissionController } from "./admin.submission.controller.js";
import { authenticateJWT } from "../auth/auth.middleware.js";
import { requireAdmin } from "../auth/role.middleware.js";

const router = Router();

router.use(authenticateJWT, requireAdmin);

router.get("/admin/submissions/pending", AdminSubmissionController.getPending);
router.put(
  "/admin/submissions/:id/review",
  AdminSubmissionController.review
);

export default router;
