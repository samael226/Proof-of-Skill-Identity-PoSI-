import { Router } from "express";
import { VerificationController } from "./verification.controller.js";

const router = Router();

// 🌍 Public — no auth
router.get("/verify/user/:userId/skills", VerificationController.getUserSkills);
router.get("/verify/user/:userId/skills/:skill", VerificationController.getUserSkillByName);

export default router;
