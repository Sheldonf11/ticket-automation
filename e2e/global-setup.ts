import { execSync } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';

export default async function globalSetup() {
  const serverDir = path.resolve(process.cwd(), './server');
  
  // Load the test env to get test configuration
  const parsedEnv = dotenv.config({ path: path.join(serverDir, '.env.test'), override: true }).parsed;
  
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }
  
  const envConfig = {
    ...process.env,
    ...parsedEnv,
    ALLOW_SEED_SIGNUP: 'true'
  };

  try {
    console.log('Resetting and pushing schema to test database...');
    execSync('bunx prisma db push --force-reset', {
      cwd: serverDir,
      env: envConfig,
      stdio: 'inherit'
    });
    
    console.log('Running database seed script...');
    execSync('bun run db:seed', {
      cwd: serverDir,
      env: envConfig,
      stdio: 'inherit'
    });
    
    console.log('Database setup complete.');
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }
}
