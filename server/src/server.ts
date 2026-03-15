import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectToDatabase } from './config/db.js';

const PORT = Number(process.env.PORT ?? 4000);
const MONGODB_URI = process.env.MONGODB_URI;

async function start() {
  console.log('Starting server...');
  console.log('PORT:', PORT);
  console.log('Has MONGODB_URI:', Boolean(MONGODB_URI));

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  console.log('Connecting to MongoDB...');
  await connectToDatabase(MONGODB_URI);
  console.log('MongoDB connected.');

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
