import { WebSocketServer } from 'ws';

const WS_PORT = 8080;
// Creating a new websocket server
const wss = new WebSocketServer({ port: WS_PORT });

console.log(`WebSocket server is running on port ${WS_PORT}...`);

// What occurs on connection
wss.on('connection', (ws) => {
  console.log('New client connected...');

  // sending message
  ws.on('message', (data) => {
    console.log(`Client has sent us: ${data}`);
  });

  // What occurs on disconnection
  ws.on('close', () => {
    console.log('Client has disconnected...');
  });
});
