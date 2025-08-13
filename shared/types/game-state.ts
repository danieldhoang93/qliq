export type DamageEvent = {
  userId: number;
  amount: number;
  serverId?: number;
  teamId?: number | null;
  timestamp: number;
  style?: string;
};
