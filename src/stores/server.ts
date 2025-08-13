import { proxy } from 'valtio';

export const useServer = proxy<{
  servers: any[];
}>({
  servers: [],
});

export function initializeServers(servers: any[]) {
  useServer.servers = servers;
}
