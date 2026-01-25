import { Request, Response } from "express";
import { SubmissionService } from "../submissions/submission.service.js";
import { AdminSubmissionService } from "./adminSubmission.service.js";
import { UserSkillService } from "../../services/userSkill.service.js";

export const AdminSubmissionController = {

  // 📥 Pending queue (simple view)
  async getPending(_req: Request, res: Response) {
    const submissions = await SubmissionService.getPendingSubmissions();
    res.json(submissions);
  },

  // 📊 Dashboard stats
  async stats(_req: Request, res: Response) {
    const stats = await AdminSubmissionService.getStats();
    res.json(stats);
  },

  // 🔍 Filtered list
  async list(req: Request, res: Response) {
    const submissions = await AdminSubmissionService.getFiltered(req.query);
    res.json(submissions);
  },

  // 🔎 Single submission
  async getOne(req: Request, res: Response) {
    const submission = await AdminSubmissionService.getById(
      Number(req.params.id)
    );
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.json(submission);
  },

  // ✅ Review submission
  async review(req: Request, res: Response) {
    const submissionId = Number(req.params.id);
    const { status, score, feedback } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await AdminSubmissionService.reviewSubmission(
      submissionId,
      status,
      score,
      feedback
    );

    // 🔁 Update user skill only if approved
    if (status === "APPROVED") {
      await UserSkillService.recomputeUserSkill(
        updated.user_id,
        updated.skill_id
      );
    }

    res.json(updated);
  }
};
