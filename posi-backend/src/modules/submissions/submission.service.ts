import { pool } from '../../config/db';

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
    score: number
  ) {
    const result = await pool.query(
      `
      UPDATE submissions
      SET status = $1, score = $2
      WHERE id = $3
      RETURNING *
      `,
      [status, score, id]
    );
    return result.rows[0];
  },

  async deleteSubmission(id: number) {
    const result = await pool.query(
      'DELETE FROM submissions WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
};
