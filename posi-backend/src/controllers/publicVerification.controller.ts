import { Request, Response } from "express";
import { PublicVerificationService } from "../services/publicVerification.service.js";

export const getPublicUserVerification = async (
  req: Request,
  res: Response
) => {
  const userId = Number(req.params.userId);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const data = await PublicVerificationService.getUserPublicSkills(userId);

  if (!data) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(data);
};
