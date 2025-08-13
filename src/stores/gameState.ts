// stores/gameState.ts
import { proxy } from 'valtio';
import { proxyMap } from 'valtio/utils';
import { sendClick } from '@/ws/wsClient';
import type { DamageEvent } from 'shared/types/game-state';

// If you truly need style here but only available via a hook,
// pass it into onQliq(style) from a component (shown below).
export const gameState = proxy({
  userId: 1 as number,
  currentServerId: 1 as number,
  currentTeamId: undefined as number | undefined,

  // per-user queues and totals
  queues: proxyMap<number, DamageEvent[]>(),
  totalDamageDone: 0 as number,
});

export function setInitialTotalDamage(total: number, userId = gameState.userId) {
  gameState.totalDamageDone = total;
}

export function incrementTotalDamage(amount: number, userId = gameState.userId) {
  gameState.totalDamageDone += amount;
}

export function setCurrentServerId(serverId: number) {
  gameState.currentServerId = serverId;
}
export function setCurrentTeamId(teamId?: number) {
  gameState.currentTeamId = teamId;
}

/**
 * Enqueue a local click for *this* user and send to server.
 * Pass style in from UI to avoid calling hooks here.
 */
export function onQliq(amount = 1, style?: string) {
  const timestamp = Date.now();
  const { currentServerId, currentTeamId, userId } = gameState;

  // enqueue to this user's queue
  enqueueDamage({ userId, amount, timestamp, style });

  // fire to server
  sendClick(amount, currentServerId, currentTeamId, style);
}

/** Drain and clear a user's queue (called by that user's UI renderer). */
export function takeUserBatch(userId: number): DamageEvent[] {
  const arr = gameState.queues.get(userId) ?? [];
  if (arr.length === 0) return [];
  gameState.queues.set(userId, []); // clear
  return arr;
}

export function enqueueDamage(e: DamageEvent) {
  const arr = gameState.queues.get(e.userId) ?? [];
  arr.push(e);
  gameState.queues.set(e.userId, arr);
}
