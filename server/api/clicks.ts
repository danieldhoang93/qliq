import express from 'express';
import { totalForTeam, totalForServer } from 'server/services/clicks';

const clicksRouter = express.Router();

clicksRouter.get('/total', async (req, res) => {
  try {
    const serverId = req.query.serverId as string | undefined;
    const teamId = req.query.teamId as string | undefined;

    if (!serverId) {
      return res.status(400).json({ error: 'serverId is required' });
    }

    const total = teamId ? await totalForTeam(serverId, teamId) : await totalForServer(serverId);

    res.json({ total });
  } catch (err) {
    console.error('Error fetching total:', err);
    res.status(500).json({ error: 'Failed to get total' });
  }
});

export default clicksRouter;
