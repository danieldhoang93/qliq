import { logClick } from 'server/services/clicks';
import { WebSocket } from 'ws';

type RoomId = string;
const rooms = new Map<RoomId, Set<WebSocket>>();
const totals = new Map<RoomId, number>();

export function joinRoom(ws: WebSocket, roomId: string) {
  console.log('joining room', rooms);
  if (!rooms.has(roomId)) rooms.set(roomId, new Set());
  console.log('joining room', roomId);
  rooms.get(roomId)!.add(ws);
  (ws as any).roomId = roomId;

  const total = totals.get(roomId) ?? 0;
  ws.send(JSON.stringify({ type: 'total', roomId, total }));
}

export function leaveRoom(ws: WebSocket) {
  const roomId = (ws as any).roomId as string | undefined;
  console.log('leaving room', roomId);
  if (!roomId) return;
  rooms.get(roomId)?.delete(ws);
  delete (ws as any).roomId;
}

export async function addClick(
  ws: WebSocket,
  amount: number,
  userId: number,
  serverId: number,
  teamId: number | null,
  style: string = 'default'
) {
  const roomId = (ws as any).roomId;
  console.log({ amount, userId, roomId });
  if (!roomId) return;
  const newTotal = (totals.get(roomId) ?? 0) + amount;
  totals.set(roomId, newTotal);

  await logClick(userId, serverId, teamId, amount);

  const payload = JSON.stringify({
    type: 'damage',
    damageEvent: {
      userId,
      amount,
      timestamp: Date.now(),
      serverId,
      teamId,
      style,
    },
  });

  for (const client of rooms.get(roomId) ?? []) {
    if ((client as any).readyState === 1) client.send(payload);
  }
}
