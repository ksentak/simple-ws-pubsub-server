import { Server, createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { createWebSocketServer } from '../../wss';

interface TestServerResponse {
  testServer: Server;
  wss: WebSocketServer;
}

// Creates a test server
const startTestServer = (port): Promise<TestServerResponse> => {
  const testServer = createServer();
  const wss = createWebSocketServer(testServer);

  return new Promise((resolve) => {
    testServer.listen(port, () => resolve({ testServer, wss }));
  });
};

const waitForSocketState = (socket, state) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      if (socket.readyState === state) {
        resolve();
      } else {
        waitForSocketState(socket, state).then(resolve);
      }
    }, 10);
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
      client.close();
    }
  });

  return [client, messages];
};

export { startTestServer, waitForSocketState, createWsClient };
