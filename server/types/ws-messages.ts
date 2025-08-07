import { DamageEvent } from "shared/types/game-state";

// Message types sent from client to server
export type ClientMessage =
  | { type: 'identify'; userId: string }
  | { type: 'click'; damageEvent: DamageEvent }
  | { type: 'join_team'; teamId: string }
  | { type: 'update_attribute'; attribute: string; value: number };

// Message types sent from server to client
export type ServerMessage =
  | { type: 'welcome'; userId: string }
  | { type: 'team_update'; teamId: string; score: number }
  | { type: 'error'; message: string }
  | { type: 'damage'; damageEvent: DamageEvent };
