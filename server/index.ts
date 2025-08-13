import { createHttp } from './http';
import { attachWebSocket } from './ws';
import 'dotenv/config';

const HTTP_PORT = 3001;

const httpServer = createHttp();
httpServer.listen(HTTP_PORT, () => {
  console.log(`🚀 REST API on http://localhost:${HTTP_PORT}`);
});

attachWebSocket(httpServer); // WS piggybacks the same server (optional)
