import express from 'express';
import cors from 'cors';
import itineraryRoutes from './routes/itineraryRoutes.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/itineraries', itineraryRoutes);

export default app;
