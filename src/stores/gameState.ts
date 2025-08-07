
import { sendClick } from '@/ws/wsClient';
import { DamageEvent } from 'shared/types/game-state';
import { proxy } from 'valtio';

export const gameState = proxy<{
  userId: string;
  totalDamage: number;
  damageEvents: DamageEvent[];
}>({
  userId: 'user123',
  totalDamage: 0,
  damageEvents: [],
});

export function onQliq(amount = 1, style = 'default') {
  const timestamp = Date.now();

  gameState.damageEvents.push({
    userId: gameState.userId,
    amount,
    timestamp,
    style,
  });

  incrementTotalDamage(amount);
  sendClick(amount);
}

export function setInitialTotalDamage(total: number) {
  gameState.totalDamage = total;
}

export function incrementTotalDamage(amount: number) {
  gameState.totalDamage += amount;
}
