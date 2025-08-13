import express from 'express';
import http from 'http';
import clicksRouter from './api/clicks';
import serversRouter from './api/servers';

export function createHttp() {
  const app = express();
  app.use(express.json());
  app.use('/api', clicksRouter);
  app.use('/api/servers', serversRouter);

  const server = http.createServer(app);
  return server;
}
