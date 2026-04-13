import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import { requireAuth } from './middleware/requireAuth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Better Auth handler MUST be mounted before express.json()
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(cors({ 
  origin: process.env.FRONTEND_URL || "http://localhost:5173", 
  credentials: true 
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/me', requireAuth, (req, res) => {
  res.json({ user: req.user, session: req.session });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
