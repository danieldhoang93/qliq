// server/routes/servers.ts
import { Router } from 'express';
import { getAllServers } from '../services/servers';

const serversRouter = Router();

serversRouter.get('/', async (req, res) => {
  try {
    const data = await getAllServers();
    res.json({ servers: data });
  } catch (err) {
    console.error('Failed to fetch servers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default serversRouter;
