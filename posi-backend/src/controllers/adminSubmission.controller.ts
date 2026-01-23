import { Request, Response } from "express";
import { SubmissionService } from "../modules/submissions/submission.service.js";
import { UserSkillService } from "../services/userSkill.service.js";

export const AdminSubmissionController = {

  getPending: async (_req: Request, res: Response) => {
    const submissions = await SubmissionService.getPendingSubmissions();
    res.json(submissions);
  },

  review: async (req: Request, res: Response) => {
    const submissionId = Number(req.params.id);
    const { status, score, feedback } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const submission = await SubmissionService.reviewSubmission(
      submissionId,
      status,
      score,
      feedback
    );

    // 🔥 ONLY update skill if approved
    if (status === "APPROVED") {
      await UserSkillService.recomputeUserSkill(
        submission.user_id,
        submission.skill_id
      );
    }

    res.json(submission);
  },
};
