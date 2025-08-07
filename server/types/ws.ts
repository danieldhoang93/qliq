import { WebSocket } from 'ws';

export type WSClient = {
  id: string;
  socket: WebSocket;
  userId: string;
};