import { Router } from "express";
import { requireAdmin } from "../modules/auth/role.middleware.js";
import { reviewSkillSubmission } from "../controllers/adminSkill.controller.js";

const router = Router();

router.post(
  "/admin/skills/:id/review",
  requireAdmin,
  reviewSkillSubmission
);

export default router;
