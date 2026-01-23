import { Request, Response } from "express";
import { UserSkillService } from "../../services/userSkill.service.js";

export const VerificationController = {
  getUserSkills: async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const skills = await UserSkillService.getSkillsByUser(userId);

    return res.json({
      userId,
      verifiedSkills: skills.filter(s => s.verified),
      generatedAt: new Date().toISOString()
    });
  },

  getUserSkillByName: async (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const skillName = req.params.skill;

    const skills = await UserSkillService.getSkillsByUser(userId);
    const skill = skills.find(
      s => s.name.toLowerCase() === skillName.toLowerCase()
    );

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    return res.json({
      userId,
      proof: skill,
      verified: skill.verified
    });
  }
};
