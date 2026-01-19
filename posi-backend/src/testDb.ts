import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('DB Connection String:', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testDb() {
  const client = await pool.connect();
  try {
    console.log('Connected to database');
    const res = await client.query('SELECT NOW()');
    console.log('Current time:', res.rows[0].now);
  } catch (err) {
    console.error('Error connecting to database:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

testDb();