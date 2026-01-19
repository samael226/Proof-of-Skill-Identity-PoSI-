import app from './app.js';
import { config } from 'dotenv';
import { resolve } from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

// Load environment variables
config({ path: resolve(process.cwd(), '.env') });

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

// Create a pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`PoSI API listening on port ${PORT}`);
}).on('error', (err: Error) => {
  console.error('Server error:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Test DB connection at startup
async function testDbConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to database');
    const res = await client.query('SELECT NOW()');
    console.log('DB current time:', res.rows[0].now);
    client.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
}

testDbConnection();

app.listen(PORT, () => {
  console.log(`🚀 PoSI API listening on port ${PORT}`);
});