import { createServer } from 'http';
import WebSocket from 'ws';
import { createWebSocketServer } from '../../server';

// Creates a test server
const startTestServer = (port) => {
  const testServer = createServer();
  createWebSocketServer(testServer);

  return new Promise((resolve) => {
    testServer.listen(port, () => resolve(testServer));
  });
};

const waitForSocketState = (socket, state) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      if (socket.readyState === state) {
        console.log('It has resol;ved');
        resolve();
      } else {
        waitForSocketState(socket, state).then(resolve);
      }
    }, 100);
  });
};

const createWsClient = async (
  port: number,
  closeAfter: number,
): Promise<[WebSocket, string[]]> => {
  const client = new WebSocket(`ws://localhost:${port}`);
  await waitForSocketState(client, client.OPEN);
  const messages = [];

  client.on('message', (data) => {
    messages.push(data);

    if (messages.length === closeAfter) {
      console.log('COOKIE');
      client.close();
    }
  });

  return [client, messages];
};

export { startTestServer, waitForSocketState, createWsClient };
