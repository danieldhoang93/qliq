
import express from 'express';
import { getAllClicks } from 'server/services/clicks';

export const clicksRouter = express.Router();

clicksRouter.get('/total', async (_req, res) => {
  try {
    console.log('Fetching total clicks');
    const total = await getAllClicks();
    res.json({ total });
  } catch (err) {
    console.error('Error fetching clicks:', err);
    res.status(500).json({ error: 'Failed to get clicks' });
  }
});
