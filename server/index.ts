import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { WSClient } from './types/ws.ts';
import { ClientMessage, ServerMessage } from './types/ws-messages.ts';
import express from 'express';
import { clicksRouter } from './api/clicks.ts';
import { logClick } from './services/clicks.ts';

// ✅ Create Express App
const app = express();
const HTTP_PORT = 3001;
const WS_PORT = 8080;
app.use(express.json());
app.use('/api', clicksRouter);

// // ✅ Start HTTP server
app.listen(HTTP_PORT, () => {
  console.log(`🚀 REST API running at http://localhost:${HTTP_PORT}`);
});

const clients = new Map<string, WSClient>();

const wss = new WebSocketServer({ port: WS_PORT });
console.log(`✅ WebSocket server running on http://localhost:${WS_PORT}`);

let connectionCount = 0;

wss.on('connection', (socket) => {
  console.log('👋 New client connected');
  connectionCount += 1;
  const userId = `${connectionCount}`;
  (socket as any).userId = userId;

  const clientId = uuidv4();
  const client: WSClient = { id: clientId, socket, userId };
  clients.set(clientId, client);

  socket.on('message', async (data) => {
    const msg = JSON.parse(data.toString()) as ClientMessage;

    if (msg.type === 'identify') {
      client.userId = userId;

      // Optionally echo it back
      socket.send(JSON.stringify({
        type: 'welcome',
        userId: client.userId,
      }));

      return;
    }

    if (msg.type === 'click') {
      await logClick(client.userId, msg.damageEvent.timestamp);
      for (const [id, otherClient] of clients) {
        if (id !== clientId && otherClient.socket.readyState === WebSocket.OPEN) {
          const serverMsg: ServerMessage = {
            type: 'damage',
            damageEvent: {
              userId: client.userId,
              amount: msg.damageEvent.amount,
              timestamp: msg.damageEvent.timestamp,
              style: undefined,
            }
          };
          otherClient.socket.send(JSON.stringify(serverMsg));
        }
      }
    }
  });

  socket.on('close', () => {
    clients.delete(clientId);
    console.log(`❌ Client ${clientId} disconnected`);
  });
});

// import { WebSocketServer } from 'ws';
// import { v4 as uuidv4 } from 'uuid';
// import { ClientMessage, ServerMessage } from '@shared/types/ws-messages.js';
// import { WSClient } from '@shared/types/ws.ts';
// import express from 'express';
// import { clicksRouter } from './api/clicks.ts';
// console.log('👋 Server file loaded');

// // ✅ Create Express App
// const app = express();
// const HTTP_PORT = 3001;
// const WS_PORT = 8080;
// // app.use(express.json());
// // app.use('/api', clicksRouter);

// // // ✅ Start HTTP server
// // app.listen(HTTP_PORT, () => {
// //   console.log(`🚀 REST API running at http://localhost:${HTTP_PORT}`);
// // });

// // ✅ Start WebSocket Server
// const clients = new Map<string, WSClient>();

// const wss = new WebSocketServer({ port: WS_PORT });
// console.log(`✅ WebSocket server running on http://localhost:${WS_PORT}`);

// wss.on('connection', (socket) => {
//   const clientId = uuidv4();
//   const client: WSClient = { id: clientId, socket, userId: '' };
//   clients.set(clientId, client);

//   socket.on('message', (data) => {
//     const msg = JSON.parse(data.toString()) as ClientMessage;

//     if (msg.type === 'identify') {
//       client.userId = msg.userId;
//       return;
//     }

//     if (msg.type === 'click') {
//       // console.log(`🖱️ ${client.userId} clicked`, {msg});

//       // Broadcast to all other clients
//       for (const [id, otherClient] of clients) {
//         if (id !== clientId && otherClient.socket.readyState === WebSocket.OPEN) {
//           const serverMsg: ServerMessage = {
//             type: 'damage',
//             userId: client.userId,
//             amount: msg.amount,
//             timestamp: msg.timestamp,
//             style: undefined,
//           };
//           otherClient.socket.send(JSON.stringify(serverMsg));
//         }
//       }
//     }
//   });

//   socket.on('close', () => {
//     clients.delete(clientId);
//     console.log(`❌ Client ${clientId} disconnected`);
//   });
// });
