import {
  startTestServer,
  waitForSocketState,
  createWsClient,
} from './testUtils/wsTestUtils';
import * as wsHandlers from '../utils/wsHandlers';

const port = 9000;

describe('WebSocket Server', () => {
  let server;
  let wss;

  beforeAll(async () => {
    const response = await startTestServer(port);
    server = response.testServer;
    wss = response.wss;
  });

  afterAll(async () => {
    await new Promise((resolve) => wss.close(resolve));
    await new Promise((resolve) => server.close(resolve));
    jest.clearAllMocks();
  });

  it('should call publishMsg', async () => {
    const publishSpy = jest.spyOn(wsHandlers, 'publishMsg');
    const [client] = await createWsClient(port, 1);
    const msg = {
      msgType: 'publish',
      msg: 'hey there',
      topic: 'topic_001',
    };

    client.send(JSON.stringify(msg));

    await waitForSocketState(client, client.CLOSED);

    expect(publishSpy).toHaveBeenCalled();
  });

  it('should call subscribeToTopic', async () => {
    const subscribeSpy = jest.spyOn(wsHandlers, 'subscribeToTopic');
    const [client] = await createWsClient(port, 1);
    const msg = {
      msgType: 'subscribe',
      topic: 'topic_001',
    };

    client.send(JSON.stringify(msg));

    await waitForSocketState(client, client.CLOSED);

    expect(subscribeSpy).toHaveBeenCalled();
    subscribeSpy.mockRestore();
  });

  it('should call unsubscribeFromTopic', async () => {
    const unsubscribeSpy = jest.spyOn(wsHandlers, 'unsubscribeFromTopic');
    const [client] = await createWsClient(port, 2);
    const subMsg = {
      msgType: 'subscribe',
      topic: 'topic_001',
    };
    const unsubMsg = {
      msgType: 'unsubscribe',
      topic: 'topic_001',
    };

    await client.send(JSON.stringify(subMsg));
    await client.send(JSON.stringify(unsubMsg));

    await waitForSocketState(client, client.CLOSED);

    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should send invalid msgType', async () => {
    const [client, messages] = await createWsClient(port, 1);
    const msg = {
      msgType: 'test',
      topic: 'topic_001',
    };

    client.send(JSON.stringify(msg));

    await waitForSocketState(client, client.CLOSED);

    const response = messages.toString();

    expect(response).toEqual(
      `Invalid msgType. You must include a msgType of "publish", "subscribe", or "unsubscribe".`,
    );
  });

  // it('should clean up after client disconnects', async () => {
  //   const [client] = await createWsClient(port, 1);

  //   // Subscribe to a topic
  //   client.send(JSON.stringify({ msgType: 'subscribe', topic: 'topic_001' }));

  //   // Wait for the subscription to be processed
  //   await new Promise((resolve) => setTimeout(resolve, 100));

  //   // Disconnect the client
  //   client.close();

  //   await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for cleanup

  //   // Now, check if the server has cleaned up correctly
  //   // This can be a bit tricky since you need to access the server's internal state
  //   // One way to do this could be to expose some kind of debug route or function in your server code that lets you inspect the current state of topics and subscriptions
  //   // Alternatively, you could spy/mock relevant functions to ensure they were called with the expected arguments
  // });
});
