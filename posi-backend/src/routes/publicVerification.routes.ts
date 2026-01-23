import { Router } from "express";
import { getPublicUserVerification } from "../controllers/publicVerification.controller.js";

const router = Router();

router.get("/verify/users/:userId", getPublicUserVerification);

export default router;
