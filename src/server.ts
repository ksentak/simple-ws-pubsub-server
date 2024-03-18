import { WebSocketServer } from 'ws';
import {
  publishMsg,
  subscribeToTopic,
  unsubscribeFromTopic,
} from './utils/wsUtils';
import { WsMsg, Socket } from './interfaces/ws';
import { WS_PORT, PING_INTERVAL } from './config';

const listeners = {};

// Function to clean up stale connections
const removeStaleConnections = () => {
  wss.clients.forEach((ws: Socket) => {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
};

// Creating a new websocket server
const wss = new WebSocketServer({ port: WS_PORT });

console.log(`WebSocket server is running on port ${WS_PORT}...`);

// Setup a ping intertval to check for stale connections
setInterval(removeStaleConnections, PING_INTERVAL);

// What occurs on connection
wss.on('connection', (ws: Socket) => {
  console.log('New client connected...');
  ws.isAlive = true;

  // Respond to pings to mark the connection as alive
  ws.on('pong', () => {
    ws.isAlive = true;
  });

  // Handle incoming messages
  ws.on('message', (data: string) => {
    try {
      // Attempt to parse incoming data
      const parsedData: WsMsg = JSON.parse(data);
      const { msg, msgType, topic } = parsedData;

      // Handle different message types
      switch (msgType) {
        case 'publish':
          publishMsg(ws, msg, topic, listeners);
          break;
        case 'subscribe':
          if (Array.isArray(listeners[topic])) {
            listeners[topic].push(ws);
          } else {
            listeners[topic] = [];
            listeners[topic].push(ws);
          }
          subscribeToTopic(ws, topic);
          break;
        case 'unsubscribe':
          listeners[topic] = listeners[topic].filter(
            (websocket) => websocket != ws,
          );
          unsubscribeFromTopic(ws, topic);
          break;
        default:
          ws.send(
            'Invalid msgType. You must include a msgType of "publish", "subscribe", or "unsubscribe".',
          );
      }
    } catch (error) {
      console.error('Failed to process message:', error);
      ws.send('Error processing your message.');
    }
  });

  // What connection closure and clean up
  ws.on('close', () => {
    console.log('Client has disconnected...');
    Object.keys(listeners).forEach((topic) => {
      listeners[topic] = listeners[topic].filet((client) => client !== ws);
    });
  });
});
