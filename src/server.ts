import { WebSocketServer } from 'ws';
import {
  publishMsg,
  subscribeToTopic,
  unsubscribeFromTopic,
} from './utils/wsUtils';
import { wsMsg } from './interfaces/wsMsg';

const WS_PORT = 8080;
// Creating a new websocket server
const wss = new WebSocketServer({ port: WS_PORT });

console.log(`WebSocket server is running on port ${WS_PORT}...`);

// What occurs on connection
wss.on('connection', (ws) => {
  console.log('New client connected...');
  const listeners = {};

  // sending message
  ws.on('message', (data: string) => {
    // Destructure data object
    const parsedData: wsMsg = JSON.parse(data);
    const { msg, msgType, topic } = parsedData;

    // Eventually I will extract these functions out
    switch (msgType) {
      case 'publish':
        publishMsg(ws, msg, topic, listeners);
        break;
      case 'subscribe':
        if (listeners[topic]) {
          listeners[topic].push(ws);
        } else {
          listeners[topic] = [];
          listeners[topic].push(ws);
        }
        subscribeToTopic(ws, topic);
        break;
      case 'unsubscribe':
        unsubscribeFromTopic(ws, topic);
        break;
      default:
        ws.send(
          'An error occurred. You must include a msgType of "publish", "subscribe", or "unsubscribe".',
        );
    }
  });

  // What occurs on disconnection
  ws.on('close', () => {
    console.log('Client has disconnected...');
  });
});
