import app from './app.js';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';

// Get the current directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: resolve(__dirname, '../.env') });

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

// Create a pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Test DB connection
async function testDbConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to database');
    const res = await client.query('SELECT NOW()');
    console.log('DB current time:', res.rows[0].now);
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    console.error('⚠️ Continuing to start server without DB connection.');
    return false;
  }
}

// Start the server
async function startServer() {
  try {
    await testDbConnection();
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 PoSI API listening on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Handle server errors
    server.on('error', (err: Error) => {
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
      server.close(() => process.exit(1));
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
startServer();