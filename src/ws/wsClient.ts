import { gameState, incrementTotalDamage } from "@/stores/gameState";

export const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
  console.log('✅ WebSocket connected');
};

socket.onmessage = (event) => {
  console.log('📨 Server message:', event.data);
};

socket.addEventListener('open', () => {
  socket.send(JSON.stringify({ type: 'identify', userId: 'user123' }));
});

export const sendClick = (amount: number, style = 'default') => {
  socket.send(JSON.stringify({
    type: 'click',
    damageEvent: {
      userId: 'user123',
      timestamp: Date.now(),
      amount,
    style,
    }
  }));
};

socket.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === 'damage') {
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