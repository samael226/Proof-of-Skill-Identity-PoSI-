import { pool } from '../../config/db.js';

export const SubmissionService = {
  async createSubmission(
    userId: number,
    challengeId: number,
    submittedAnswer: string,
    score: number,
    timeTaken: number,
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
  ) {
    const result = await pool.query(
      `
      INSERT INTO submissions
        (user_id, challenge_id, submitted_answer, score, time_taken_seconds, status)
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [userId, challengeId, submittedAnswer, score, timeTaken, status]
    );

    return result.rows[0];
  },

  async getAllSubmissions() {
    const result = await pool.query('SELECT * FROM submissions');
    return result.rows;
  },

  async getSubmissionById(id: number) {
    const result = await pool.query(
      'SELECT * FROM submissions WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async getSubmissionsByUser(userId: number) {
    const result = await pool.query(
      'SELECT * FROM submissions WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  },

  async updateSubmissionStatus(
    id: number,
    status: 'PENDING' | 'APPROVED' | 'REJECTED',
    score: number,
    feedback?: string
  ) {
    const result = await pool.query(
      `
      UPDATE submissions
      SET status = $1, score = $2 ,
      feedback = $3
      WHERE id = $4
      RETURNING *
      `,
      [status, score, feedback ?? null, id]
    );
    return result.rows[0];
  },

  async deleteSubmission(id: number) {
    const result = await pool.query(
      'DELETE FROM submissions WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },
 async getPendingSubmissions() {
  const result = await pool.query(`
    SELECT 
      s.id,
      s.submitted_answer,
      s.time_taken_seconds,
      s.status,
      u.username,
      c.title AS challenge_title,
      sk.name AS skill_name
    FROM submissions s
    JOIN users u ON u.id = s.user_id
    JOIN challenges c ON c.id = s.challenge_id
    JOIN skills sk ON sk.id = s.skill_id
    WHERE s.status = 'PENDING'
    ORDER BY s.created_at ASC
  `);

  return result.rows;
},

async reviewSubmission(
  submissionId: number,
  status: "APPROVED" | "REJECTED",
  score: number,
  feedback: string
) {
  const result = await pool.query(
    `
    UPDATE submissions
    SET status = $1, score = $2, feedback = $3
    WHERE id = $4
    RETURNING *
    `,
    [status, score, feedback, submissionId]
  );

  return result.rows[0];
},

};
