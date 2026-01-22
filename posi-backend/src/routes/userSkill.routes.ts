import { Router } from "express";
import { getUserSkills } from "../controllers/userSkill.controller.js";

const router = Router();

router.get("/users/:userId/skills", getUserSkills);

export default router;
