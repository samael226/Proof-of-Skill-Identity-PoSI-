import { Request, Response } from 'express';
import { SubmissionService } from './submission.service.js';
import { UserSkillService } from "../../services/userSkill.service.js";


export const SubmissionController = {
create: async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    // ✅ Explicit parsing
    const challengeId = Number(req.body.challengeId);
    const submittedAnswer = req.body.submittedAnswer as string;
    const timeTaken = Number(req.body.timeTaken ?? 0);

    if (!challengeId || !submittedAnswer) {
      return res.status(400).json({ message: 'Missing or invalid challengeId or submittedAnswer' });
    }

    if (isNaN(challengeId) || isNaN(timeTaken)) {
      return res.status(400).json({ message: 'Invalid numeric values' });
    }

    const submission = await SubmissionService.createSubmission(
      userId,
      challengeId,
      submittedAnswer,
      0,              // score
      timeTaken,
      'PENDING',
      

    );

    res.status(201).json(submission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
},



  getAll: async (_req: Request, res: Response) => {
    const submissions = await SubmissionService.getAllSubmissions();
    res.json(submissions);
  },

  getById: async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const submission = await SubmissionService.getSubmissionById(id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json(submission);
  },

  getByUser: async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId as string);
    const submissions = await SubmissionService.getSubmissionsByUser(userId);
    res.json(submissions);
  },

  updateStatus: async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { status, score, feedback } = req.body;

  if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const updated = await SubmissionService.updateSubmissionStatus(
    id,
    status,
    score,
    feedback
  );

  // 🔥 SKILL AGGREGATION (ONLY ON APPROVAL)
  if (status === 'APPROVED') {
    await UserSkillService.recomputeUserSkill(
      updated.user_id,
      updated.skill_id
    );
  }

  res.json(updated);
},

  delete: async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const deleted = await SubmissionService.deleteSubmission(id);
    res.json({ message: 'Submission deleted', submission: deleted });
  }

  
};
