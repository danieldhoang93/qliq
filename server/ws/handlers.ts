import type { WebSocket } from 'ws';
import { leaveRoom, joinRoom, addClick } from './room-manager';
import { getUserMemberships } from 'server/services/memberships';
import { Membership } from 'server/types/membership';
import { ClientMessage } from 'server/types/ws-messages';

// userIdFromServer is only needed until auth is set up
export async function handleMessage(
  ws: WebSocket,
  raw: Buffer | ArrayBuffer | Buffer[],
  userIdFromServer: string
) {
  let msg: ClientMessage;
  try {
    msg = JSON.parse((raw as Buffer).toString()) as ClientMessage;
  } catch {
    return;
  }

  console.log('handleMessage', { msg });

  switch (msg.type) {
    case 'identify': {
      console.log({ userIdFromServer });
      // 1) look up memberships for this user
      const userIdNum = Number(userIdFromServer); // adjust if your DB uses text uuids
      let memberships: Membership[] = [];
      try {
        memberships = await getUserMemberships(userIdNum);
      } catch (e) {
        console.error('membership lookup failed', e);
      }

      ws.send(
        JSON.stringify({
          type: 'welcome',
          userId: userIdFromServer,
          memberships,
        })
      );
      return;
    }

    case 'click': {
      const { damageEvent } = msg;
      console.log('click', { damageEvent });
      const uid = Number(damageEvent.userId ?? userIdFromServer);
      if (!Number.isFinite(damageEvent.amount) || damageEvent.amount <= 0) return;

      await addClick(
        ws,
        damageEvent.amount,
        uid,
        Number(damageEvent.serverId),
        damageEvent.teamId ?? null,
        damageEvent.style
      );
      return;
    }

    case 'join_team': {
      // TODO: handle join team
      return;
    }

    case 'update_attribute': {
      // TODO: handle attribute update
      return;
    }

    case 'join_server': {
      leaveRoom(ws);
      joinRoom(ws, msg.serverId);
      ws.send(JSON.stringify({ type: 'joined', serverId: msg.serverId }));
      return;
    }

    default:
      return;
  }
}

export function onConnectionClose(ws: WebSocket) {
  leaveRoom(ws);
}
