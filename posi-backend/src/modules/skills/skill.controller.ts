import { Request, Response } from 'express';
import { SkillService } from './skill.service.js';

export const SkillController = {
  create: async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      if (!name) return res.status(400).json({ message: 'Name is required' });

      const skill = await SkillService.createSkill(name, description || '');
      res.status(201).json(skill);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getAll: async (_req: Request, res: Response) => {
    const skills = await SkillService.getAllSkills();
    res.json(skills);
  },

  getById: async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const skill = await SkillService.getSkillById(id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json(skill);
  },

  update: async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const updated = await SkillService.updateSkill(id, name, description || '');
    res.json(updated);
  },

  delete: async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const deleted = await SkillService.deleteSkill(id);
    res.json({ message: 'Skill deleted', skill: deleted });
  }
};
