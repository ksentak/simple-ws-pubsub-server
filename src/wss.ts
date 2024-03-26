import { WebSocketServer } from 'ws';
import {
  publishMsg,
  subscribeToTopic,
  unsubscribeFromTopic,
} from './utils/wsHandlers';
import { WsMsg, Socket } from './interfaces/wsTypes';
import { PING_INTERVAL } from './config';

/**
 * Map to hold active listeners for different topics.
 * @type {Map<string, Set<Socket>>}
 */
const listeners = new Map();

/**
 * Creates and configures a WebSocket server attached to the provided HTTP/S server.
 * It sets up handlers for connection, message reception, and server shutdown cleanup.
 *
 * @param {Server} server - The HTTP/S server instance to attach the WebSocket server to.
 */
const createWebSocketServer = (server): WebSocketServer => {
  const wss = new WebSocketServer({ server });

  // Checks and removes stale connections from WSS
  const removeStaleConnections = () => {
    wss.clients.forEach((ws: Socket) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  };

  // Start the interval for checking stale connections.
  const intervalId = setInterval(removeStaleConnections, PING_INTERVAL);

  /**
   * Cleans up resources when the WebSocket server closes, including clearing the
   * interval for stale connection checks and closing all active connections.
   */
  const cleanupAndClose = () => {
    clearInterval(intervalId);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.close();
      }
    });

    listeners.clear();
  };

  wss.on('close', cleanupAndClose);

  // What occurs on connection
  wss.on('connection', (ws: Socket) => {
    console.log('New client connected...');
    ws.isAlive = true;

    // Respond to pings to mark the connection as alive
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    /**
     * Handles incoming messages from clients, parsing the message data and performing actions
     * based on the message type, such as publishing a message, subscribing to a topic,
     * or unsubscribing from a topic.
     *
     * @param {string} data - The raw message data received from a client.
     */
    ws.on('message', (data: string) => {
      try {
        const parsedData: WsMsg = JSON.parse(data);
        const { msg, msgType, topic } = parsedData;

        // Handle different message types
        switch (msgType) {
          case 'publish':
            publishMsg(ws, msg, topic, listeners);
            break;
          case 'subscribe':
            if (!listeners.has(topic)) {
              // Initialize with a new Set if topic doesn't exist
              listeners.set(topic, new Set());
            }
            // Add the socket to the Set
            listeners.get(topic).add(ws);
            subscribeToTopic(ws, topic);
            break;
          case 'unsubscribe':
            if (listeners.has(topic)) {
              // Remove the socket from the Set
              listeners.get(topic).delete(ws);
              unsubscribeFromTopic(ws, topic);
            }
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

    /**
     * Cleans up after a connection is closed, including removing the client from
     * any subscribed topics and potentially deleting empty topic sets.
     */
    ws.on('close', () => {
      console.log('Client has disconnected...');
      listeners.forEach((clients, topic) => {
        // Remove the socket from each Set
        clients.delete(ws);
        // Remove the topic if no subscribers are left
        if (clients.size === 0) {
          listeners.delete(topic);
        }
      });
    });
  });

  return wss;
};

export { createWebSocketServer };
