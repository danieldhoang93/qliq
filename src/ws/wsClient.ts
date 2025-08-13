import { enqueueDamage, gameState, setCurrentServerId } from '@/stores/gameState';
import { updateUser } from '@/stores/user';
import { DamageEvent } from 'shared/types/game-state';

export const socket = new WebSocket('ws://localhost:3001');

let userId: string | null = null;

socket.onopen = () => {
  console.log('✅ WebSocket connected');
};

socket.onmessage = (event) => {};

socket.addEventListener('open', () => {
  socket.send(JSON.stringify({ type: 'identify', userId }));
});

export const sendClick = (
  amount: number,
  serverId: number,
  teamId: number | undefined,
  style = 'default'
) => {
  socket.send(
    JSON.stringify({
      type: 'click',
      damageEvent: {
        userId: gameState.userId,
        timestamp: Date.now(),
        amount,
        serverId,
        teamId,
        style,
      },
    })
  );
};

socket.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === 'welcome') {
    console.log('welcome', { msg });
    userId = msg.userId;
    const serverIdToJoin = 1;
    setCurrentServerId(serverIdToJoin); // TODO: default to previously connected server and team
    gameState.userId = msg.userId;

    updateUser(msg.memberships.users);
    socket.send(JSON.stringify({ type: 'join_server', serverId: serverIdToJoin }));
  }

  if (msg.type === 'damage' && userId) {
    const e = msg.damageEvent;
    const incoming: DamageEvent = {
      userId: Number(e.userId),
      amount: e.amount,
      timestamp: Number(e.timestamp),
      serverId: e.serverId != null ? Number(e.serverId) : undefined,
      teamId: e.teamId != null ? Number(e.teamId) : undefined,
      style: e.style,
    };

    // ignore if damage came from self
    if (msg.damageEvent.userId == gameState.userId) return;

    enqueueDamage(incoming);
  }
});
