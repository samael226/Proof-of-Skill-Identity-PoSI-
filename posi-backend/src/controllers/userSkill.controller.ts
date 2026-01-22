import { Request, Response } from "express";
import { UserSkillService } from "../services/userSkill.service.js";


export const getUserSkills = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const skills = await UserSkillService.getSkillsByUser(userId);
  res.json(skills);
};
