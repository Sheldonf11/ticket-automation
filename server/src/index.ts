import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import { requireAuth } from './middleware/requireAuth';
import { requireAdmin } from './middleware/requireAdmin';

dotenv.config();

// Startup validation for required environment variables
const requiredEnvVars = ["DATABASE_URL", "BETTER_AUTH_SECRET", "BETTER_AUTH_URL", "FRONTEND_URL"];
const missingVars = requiredEnvVars.filter(env => !process.env[env]);
if (missingVars.length > 0) {
  console.error(`FATAL: Missing required environment variables: ${missingVars.join(", ")}`);
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ 
  origin: process.env.FRONTEND_URL, 
  credentials: true 
}));
app.use(express.json({ limit: '1mb' }));


// Better Auth handler MUST be mounted before other routes but AFTER cors
app.all("/api/auth/*splat", toNodeHandler(auth));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/me', requireAuth, (req, res) => {
  const { token, ...safeSession } = req.session as any;
  res.json({ user: req.user, session: safeSession });
});

app.get('/api/admin', requireAdmin, (req, res) => {
  res.json({ status: 'admin area ok', user: req.user });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
