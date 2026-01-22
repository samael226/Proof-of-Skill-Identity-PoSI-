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
  },
  calculateLevel(avgScore: number): "BEGINNER" | "INTERMEDIATE" | "EXPERT" {
    if (avgScore >= 70) return "EXPERT";
    if (avgScore >= 40) return "INTERMEDIATE";
    return "BEGINNER";
  },
  async updateAfterApprovedSubmission(
    userId: number,
    skillId: number,
    score: number
  ) {
    // 1️⃣ Insert or update
    const result = await pool.query(
      `
      INSERT INTO user_skills (user_id, skill_id, total_score)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, skill_id)
      DO UPDATE SET
        total_score = user_skills.total_score + $3
      RETURNING *
      `,
      [userId, skillId, score]
    );

    const totalScore = result.rows[0].total_score;

    // 2️⃣ Count approved submissions
    const countRes = await pool.query(
      `
      SELECT COUNT(*) 
      FROM submissions
      WHERE user_id = $1
        AND skill_id = $2
        AND status = 'APPROVED'
      `,
      [userId, skillId]
    );

    const count = Number(countRes.rows[0].count);
    const avg = totalScore / count;
    const level = UserSkillService.calculateLevel(avg);

    // 3️⃣ Update derived fields
    await pool.query(
      `
      UPDATE user_skills
      SET average_score = $1, level = $2
      WHERE user_id = $3 AND skill_id = $4
      `,
      [avg, level, userId, skillId]
    );
  },
  calculateBadge(
  avgScore: number,
  level: "BEGINNER" | "INTERMEDIATE" | "EXPERT"
): "BRONZE" | "SILVER" | "GOLD" | null {
  if (avgScore >= 85 && level === "EXPERT") return "GOLD";
  if (avgScore >= 70 && level !== "BEGINNER") return "SILVER";
  if (avgScore >= 50) return "BRONZE";
  return null;
},

};
