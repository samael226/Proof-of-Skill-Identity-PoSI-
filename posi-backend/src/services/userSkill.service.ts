import { pool } from "../config/db.js";

type Level = "BEGINNER" | "INTERMEDIATE" | "EXPERT";
type Badge = "BRONZE" | "SILVER" | "GOLD" | null;

export const UserSkillService = {
  calculateLevel(avg: number): Level {
    if (avg >= 70) return "EXPERT";
    if (avg >= 40) return "INTERMEDIATE";
    return "BEGINNER";
  },

  calculateBadge(avg: number, level: Level): Badge {
    if (avg >= 85 && level === "EXPERT") return "GOLD";
    if (avg >= 70 && level !== "BEGINNER") return "SILVER";
    if (avg >= 50) return "BRONZE";
    return null;
  },

  async recomputeUserSkill(userId: number, skillId: number) {
    const result = await pool.query(
      `
      SELECT
        COUNT(*) AS submissions_count,
        COALESCE(SUM(score), 0) AS total_score,
        COALESCE(AVG(score), 0) AS average_score
      FROM submissions
      WHERE user_id = $1
        AND skill_id = $2
        AND status = 'APPROVED'
      `,
      [userId, skillId]
    );

    const count = Number(result.rows[0].submissions_count);
    const totalScore = Number(result.rows[0].total_score);
    const avgScore = Number(result.rows[0].average_score);

    const level = this.calculateLevel(avgScore);
    const badge = this.calculateBadge(avgScore, level);

    const verified = count >= 3 && avgScore >= 70;

    await pool.query(
      `
      INSERT INTO user_skills (
        user_id,
        skill_id,
        total_score,
        average_score,
        level,
        badge,
        verified,
        verified_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7, CASE WHEN $7 THEN NOW() ELSE NULL END)
      ON CONFLICT (user_id, skill_id)
      DO UPDATE SET
        total_score = EXCLUDED.total_score,
        average_score = EXCLUDED.average_score,
        level = EXCLUDED.level,
        badge = EXCLUDED.badge,
        verified = EXCLUDED.verified,
        verified_at = EXCLUDED.verified_at
      `,
      [
        userId,
        skillId,
        totalScore,
        avgScore,
        level,
        badge,
        verified
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
        us.level,
        us.badge,
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
