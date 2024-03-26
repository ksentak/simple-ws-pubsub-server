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

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await new Promise((resolve) => wss.close(resolve));
    await new Promise((resolve) => server.close(resolve));
    // jest.clearAllMocks();
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

  it('should handle errors when processing messages', async () => {
    // Mock publishMsg to throw an error
    jest.spyOn(wsHandlers, 'publishMsg').mockImplementation(() => {
      throw new Error('Test Error');
    });

    const [client, messages] = await createWsClient(port, 1);

    const msg = {
      msgType: 'publish',
      msg: 'This should cause an error',
      topic: 'topic_error',
    };

    client.send(JSON.stringify(msg));

    await waitForSocketState(client, client.CLOSED);

    // Check that the error message was sent to the client
    const response = messages.toString();
    expect(response).toEqual('Error processing your message.');
  });
});
