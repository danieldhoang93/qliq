import { gameState, incrementTotalDamage } from "@/stores/gameState";

export const socket = new WebSocket('ws://localhost:8080');

let userId: string | null = null;

socket.onopen = () => {
  console.log('✅ WebSocket connected');
};

socket.onmessage = (event) => {
  console.log('📨 Server message:', event.data);
};

socket.addEventListener('open', () => {
  socket.send(JSON.stringify({ type: 'identify', userId }));
});

export const sendClick = (amount: number, style = 'default') => {
  socket.send(JSON.stringify({
    type: 'click',
    damageEvent: {
      userId: gameState.userId,
      timestamp: Date.now(),
      amount,
    style,
    }
  }));
};

socket.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === 'welcome') {
    userId = msg.userId;
    gameState.userId = msg.userId;
    console.log(`👤 Welcome as: ${userId}`);
  }

  if (msg.type === 'damage' && userId) {
    // console.log(`💥 Damage broadcasted`, {msg});

    gameState.damageEvents.push({
      userId: msg.damageEvent.userId,
      amount: msg.damageEvent.amount,
      timestamp: msg.damageEvent.timestamp,
      style: msg.damageEvent.style,
    });

    incrementTotalDamage(msg.damageEvent.amount);
  }
});