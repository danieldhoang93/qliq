import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import type { Server } from 'http';
import { WSClient } from 'server/types/ws';
import { handleMessage, onConnectionClose } from './handlers';

const clients = new Map<string, WSClient>();
let connectionCount = 0;

export function attachWebSocket(httpServer: Server) {
  const wss = new WebSocketServer({ server: httpServer });
  console.log('✅ WebSocket attached');

  wss.on('connection', (socket: WebSocket) => {
    // Assign server-generated user ID
    connectionCount += 1;
    const userId = `${connectionCount}`;
    (socket as any).userId = userId;

    const clientId = uuidv4();
    const client: WSClient = { id: clientId, socket, userId };
    clients.set(clientId, client);

    console.log(`👋 New client connected: ${userId}`);

    socket.on('message', async (data) => {
      await handleMessage(socket, data, userId); // pass it in
    });

    socket.on('close', () => {
      clients.delete(clientId);
      onConnectionClose(socket);
      console.log(`❌ Client ${clientId} (${userId}) disconnected`);
    });
  });

  return wss;
}
