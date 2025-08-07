
export type GameState = {
  userId: string;
  totalDamage: number;
  damageEvents: DamageEvent[];
  onQliq: (amount?: number, style?: string) => void;
  setInitialTotalDamage: (total: number) => void;
  incrementTotalDamage: (amount: number) => void;
};

export type DamageEvent = {
  userId: string;
  amount: number;
  timestamp: number;
  style?: string;
};