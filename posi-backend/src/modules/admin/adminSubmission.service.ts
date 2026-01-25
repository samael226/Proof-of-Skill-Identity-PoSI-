import { pool } from "../../config/db.js";

export const AdminSubmissionService = {
  async getStats() {
    const result = await pool.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status = 'PENDING') AS pending,
        COUNT(*) FILTER (WHERE status = 'APPROVED') AS approved,
        COUNT(*) FILTER (WHERE status = 'REJECTED') AS rejected,
        ROUND(AVG(score), 2) AS avg_score
      FROM submissions
    `);

    return result.rows[0];
  },

  async getFiltered(filters: any) {
    const {
      status,
      skillId,
      userId,
      minScore,
      maxScore,
      page = 1,
      limit = 10
    } = filters;

    const conditions: string[] = [];
    const values: any[] = [];

    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }
    if (skillId) {
      values.push(skillId);
      conditions.push(`skill_id = $${values.length}`);
    }
    if (userId) {
      values.push(userId);
      conditions.push(`user_id = $${values.length}`);
    }
    if (minScore) {
      values.push(minScore);
      conditions.push(`score >= $${values.length}`);
    }
    if (maxScore) {
      values.push(maxScore);
      conditions.push(`score <= $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `
      SELECT *
      FROM submissions
      ${where}
      ORDER BY created_at DESC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
      `,
      [...values, limit, offset]
    );

    return result.rows;
  },

  async getById(id: number) {
    const res = await pool.query(
      `SELECT * FROM submissions WHERE id = $1`,
      [id]
    );
    return res.rows[0];
  },

  async reviewSubmission(
    id: number,
    status: "APPROVED" | "REJECTED",
    score: number,
    feedback: string
  ) {
    const res = await pool.query(
      `
      UPDATE submissions
      SET status = $1,
          score = $2,
          feedback = $3,
          reviewed_at = NOW()
      WHERE id = $4
      RETURNING *
      `,
      [status, score, feedback, id]
    );

    return res.rows[0];
  }
};
