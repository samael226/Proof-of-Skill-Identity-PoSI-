// src/modules/challenges/challenge.service.ts
import { pool } from '../../config/db.js';

export interface ChallengeInput {
  title: string;
  instructions: string;
  description: string;
  difficulty: string;
  timeLimitMinutes: number;
  maxScore: number;
  skillId: number;
  adminId: number;
}

// Create a challenge (ADMIN only)
export const createChallenge = async (input: ChallengeInput) => {
  const { title, instructions, description, difficulty, timeLimitMinutes, maxScore, skillId, adminId } = input;

  const result = await pool.query(
    `INSERT INTO challenges 
      (title, instructions, description, difficulty, time_limit_minutes, max_score, skill_id, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [title, instructions, description, difficulty, timeLimitMinutes, maxScore, skillId, adminId]
  );

  return result.rows[0];
};

// Get all challenges
export const getAllChallenges = async () => {
  const result = await pool.query(`SELECT * FROM challenges ORDER BY created_at DESC`);
  return result.rows;
};

// Get challenge by id
export const getChallengeById = async (id: number) => {
  const result = await pool.query(`SELECT * FROM challenges WHERE id = $1`, [id]);
  return result.rows[0];
};

// Update a challenge (ADMIN only)
export const updateChallenge = async (id: number, input: Partial<ChallengeInput>) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in input) {
    if (input[key as keyof ChallengeInput] !== undefined && key !== 'adminId') {
      fields.push(`${snakeCase(key)} = $${index}`);
      values.push(input[key as keyof ChallengeInput]);
      index++;
    }
  }

  if (fields.length === 0) return null;

  values.push(id);

  const result = await pool.query(
    `UPDATE challenges SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${index} RETURNING *`,
    values
  );

  return result.rows[0];
};

// Delete a challenge (ADMIN only)
export const deleteChallenge = async (id: number) => {
  const result = await pool.query(`DELETE FROM challenges WHERE id = $1 RETURNING *`, [id]);
  return result.rows[0];
};

// Helper: convert camelCase to snake_case
function snakeCase(str: string) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}
