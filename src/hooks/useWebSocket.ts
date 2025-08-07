import { ServerMessage } from '@server/types/ws-messages.ts';
import { socket } from '@src/ws/wsClient.ts';
import { useEffect } from 'react';

export function useWebSocketEvents() {
  useEffect(() => {
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data) as ServerMessage;
      if (msg.type === 'team_update') {
        // useGameStore.getState().updateTeamScore(msg.teamId, msg.score);
      }
    };
  }, []);
}