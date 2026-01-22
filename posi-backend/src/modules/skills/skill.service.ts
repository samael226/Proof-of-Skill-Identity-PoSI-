import { pool } from '../../config/db.js';

export const SkillService = {
  async createSkill(name: string, description: string) {
    const result = await pool.query(
      `INSERT INTO skills (name, description) VALUES ($1, $2) RETURNING *`,
      [name, description]
    );
    return result.rows[0];
  },

  async getAllSkills() {
    const result = await pool.query('SELECT * FROM skills ORDER BY id ASC');
    return result.rows;
  },

  async getSkillById(id: number) {
    const result = await pool.query('SELECT * FROM skills WHERE id = $1', [id]);
    return result.rows[0];
  },

  async updateSkill(id: number, name: string, description: string) {
    const result = await pool.query(
      `UPDATE skills SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
      [name, description, id]
    );
    return result.rows[0];
  },

  async deleteSkill(id: number) {
    const result = await pool.query('DELETE FROM skills WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};
