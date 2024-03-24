import {
  startTestServer,
  waitForSocketState,
  createWsClient,
} from './testUtils/wsTestUtils';
import * as wsHandlers from '../utils/wsHandlers';

const port = 9000;

describe('WebSocket Server', () => {
  let server;

  beforeAll(async () => {
    // Start server
    server = await startTestServer(port);
  });

  afterAll(() => server.close());

  it('should call publishMsg', async () => {
    const publishMsgSpy = jest.spyOn(wsHandlers, 'publishMsg');
    const [client] = await createWsClient(port, 1);
    const msg = {
      msgType: 'publish',
      msg: 'hey there',
      topic: 'topic_001',
    };

    client.send(JSON.stringify(msg));

    await waitForSocketState(client, client.CLOSED);

    expect(publishMsgSpy).toHaveBeenCalled();
  });

  // it('should call subscribeToTopic', async () => {
  //   const msg = {
  //     msgType: 'subscribe',
  //     topic: 'topic_001',
  //   };
  //   // 1. Create test client
  //   // 2. Send client message
  //   // 3. Close the client after it receives the response
  //   // 4. Perform assertions on the response
  // });

  // it('should call unsubscribeFromTopic', async () => {
  //   const msg = {
  //     msgType: 'unsubscribe',
  //     topic: 'topic_001',
  //   };
  //   // 1. Create test client
  //   // 2. Send client message
  //   // 3. Close the client after it receives the response
  //   // 4. Perform assertions on the response
  // });

  // it('should send invalid msgType', async () => {
  //   // 1. Create test client
  //   // 2. Send client message
  //   // 3. Close the client after it receives the response
  //   // 4. Perform assertions on the response
  // });
});
