// src/modules/challenges/challenge.controller.ts
import { Request, Response } from 'express';
import * as ChallengeService from './challenge.service.js';

// Create challenge (ADMIN)
export const create = async (req: Request, res: Response) => {
  try {
    const { title, instructions, description, difficulty, timeLimitMinutes, maxScore, skillId } = req.body;

    if (!title || !instructions || !description || !difficulty) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const challenge = await ChallengeService.createChallenge({
      title,
      instructions,
      description,
      difficulty,
      timeLimitMinutes: timeLimitMinutes ?? 60,
      maxScore: maxScore ?? 100,
      skillId: skillId ?? 1,
      adminId: req.user!.id
    });

    res.status(201).json(challenge);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all challenges
export const getAll = async (_req: Request, res: Response) => {
  try {
    const challenges = await ChallengeService.getAllChallenges();
    res.json(challenges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get one challenge by ID
export const getById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const challenge = await ChallengeService.getChallengeById(id);

    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    res.json(challenge);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update challenge (ADMIN)
export const update = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const challenge = await ChallengeService.updateChallenge(id, req.body);

    if (!challenge) return res.status(404).json({ message: 'Challenge not found or no fields to update' });

    res.json(challenge);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete challenge (ADMIN)
export const remove = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const deleted = await ChallengeService.deleteChallenge(id);

    if (!deleted) return res.status(404).json({ message: 'Challenge not found' });

    res.json({ message: 'Challenge deleted', challenge: deleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
