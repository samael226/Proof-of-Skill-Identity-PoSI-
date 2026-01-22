import { pool } from "../config/db.js";

export const UserSkillService = {
  async recomputeUserSkill(userId: number, skillId: number) {
    const result = await pool.query(
      `
      SELECT
        COUNT(*) as submissions_count,
        COALESCE(SUM(score), 0) as total_score,
        COALESCE(AVG(score), 0) as average_score
      FROM submissions
      WHERE user_id = $1
        AND skill_id = $2
        AND status = 'APPROVED'
      `,
      [userId, skillId]
    );

    const { submissions_count, total_score, average_score } = result.rows[0];

    const verified =
      submissions_count >= 3 && Number(average_score) >= 70;

    await pool.query(
      `
      INSERT INTO user_skills (user_id, skill_id, total_score, average_score, verified, verified_at)
      VALUES ($1, $2, $3, $4, $5, CASE WHEN $5 THEN NOW() ELSE NULL END)
      ON CONFLICT (user_id, skill_id)
      DO UPDATE SET
        total_score = EXCLUDED.total_score,
        average_score = EXCLUDED.average_score,
        verified = EXCLUDED.verified,
        verified_at = EXCLUDED.verified_at
      `,
      [
        userId,
        skillId,
        total_score,
        average_score,
        verified,
      ]
    );
  },
  async getSkillsByUser(userId: number) {
    const result = await pool.query(
      `
      SELECT 
        s.id,
        s.name,
        us.total_score,
        us.average_score,
        us.verified,
        us.verified_at
      FROM user_skills us
      JOIN skills s ON s.id = us.skill_id
      WHERE us.user_id = $1
      `,
      [userId]
    );

    return result.rows;
  }
};
