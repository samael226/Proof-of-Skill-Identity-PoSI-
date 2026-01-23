import { Request, Response } from "express";

export const reviewSkillSubmission = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { score, verified } = req.body;

  // TEMP logic (DB later)
  return res.json({
    message: "Skill submission reviewed",
    skillId: id,
    score,
    verified
  });
};
