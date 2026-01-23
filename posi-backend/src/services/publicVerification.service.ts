import { pool } from "../config/db.js";

export const PublicVerificationService = {
  async getUserPublicSkills(userId: number) {
    // 1️⃣ User info
    const userRes = await pool.query(
      `
      SELECT id, username
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (userRes.rowCount === 0) return null;

    // 2️⃣ Skills
    const skillsRes = await pool.query(
      `
      SELECT
        s.id,
        s.name,
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

    return {
      user: userRes.rows[0],
      skills: skillsRes.rows.map((row) => ({
        id: row.id,
        name: row.name,
        averageScore: Number(row.average_score),
        level: row.level,
        badge: row.badge,
        verified: row.verified,
        verifiedAt: row.verified_at,
      })),
    };
  },
};
