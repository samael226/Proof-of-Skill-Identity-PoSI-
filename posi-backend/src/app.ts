import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { json } from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import adminRoutes from './routes/admin.routes.js';
import challengeRoutes from './routes/challenge.routes.js';
import submissionRoutes from './modules/submissions/submission.routes.js';
import skillRoutes from './modules/skills/skill.routes.js';
import userSkillRoutes from "./routes/userSkill.routes.js";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(json());


// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'PoSI backend running' });
});

app.use(express.json());
app.use('/api/auth', authRoutes);



// Protected routes
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/skills', skillRoutes);
app.use("/api", userSkillRoutes);


// Error handling middleware
const errorHandler: ErrorRequestHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
};
app.use(errorHandler);

export default app;