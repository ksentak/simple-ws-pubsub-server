import { WebSocket } from 'ws';
import {
  publishMsg,
  subscribeToTopic,
  unsubscribeFromTopic,
  safeSend,
} from '../utils/wsHandlers';

describe('safeSend', () => {
  let mockWebSocket: jest.Mocked<WebSocket>;
  let payload: object;

  beforeEach(() => {
    mockWebSocket = {
      send: jest.fn(),
    } as unknown as jest.Mocked<WebSocket>;

    payload = { message: 'Hello, world!' };
  });

  it('should send payload successfully', () => {
    safeSend(mockWebSocket, payload);
    expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify(payload));
  });

  it('should handle send error and call errorCallback', () => {
    const error = new Error('Failed to send');
    mockWebSocket.send.mockImplementationOnce(() => {
      throw error;
    });

    const errorCallback = jest.fn();

    safeSend(mockWebSocket, payload, errorCallback);

    expect(errorCallback).toHaveBeenCalledWith(error);
  });

  it('should not call errorCallback if not provided', () => {
    const error = new Error('Failed to send');
    mockWebSocket.send.mockImplementationOnce(() => {
      throw error;
    });

    expect(() => safeSend(mockWebSocket, payload)).not.toThrow();
    // No errorCallback provided, just asserting no unhandled errors
  });
});

describe('WebSocket Handlers', () => {
  let mockWebSocket: jest.Mocked<WebSocket>;
  let mockListeners: Map<string, Set<WebSocket>>;

  beforeEach(() => {
    // Mock the WebSocket instance
    mockWebSocket = {
      send: jest.fn(),
      close: jest.fn(),
      // Add other WebSocket methods as needed, mocked similarly
    } as unknown as jest.Mocked<WebSocket>;

    // Initialize a new Map for listeners in each test to ensure isolation
    mockListeners = new Map();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('publishMsg', () => {
    it('should send a message to all listeners of a topic', () => {
      const topic = 'testTopic';
      const msg = 'Hello World';
      mockListeners.set(topic, new Set([mockWebSocket]));

      publishMsg(mockWebSocket, msg, topic, mockListeners);

      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining(msg),
      );
    });

    it('should acknowledge publishMsg', () => {
      const topic = 'testTopic';
      const msg = 'Hello World';
      mockListeners.set(topic, new Set([mockWebSocket]));

      publishMsg(mockWebSocket, msg, topic, mockListeners);

      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining('Successfully published'),
      );
    });

    it('should send error msg', () => {
      const topic = 'testTopic';
      const msg = 'Hello World';
      mockListeners.set(topic, new Set([]));

      publishMsg(mockWebSocket, msg, topic, mockListeners);

      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining('Error trying to send msg.'),
      );
    });
  });

  describe('subscribeToTopic', () => {
    it('should acknowledge subscription', () => {
      const topic = 'testTopic';

      subscribeToTopic(mockWebSocket, topic);

      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining('Successfully subscribed'),
      );
    });
  });

  describe('unsubscribeFromTopic', () => {
    it('should acknowledge unsubscription', () => {
      const topic = 'testTopic';
      mockListeners.set(topic, new Set([mockWebSocket]));

      unsubscribeFromTopic(mockWebSocket, topic);

      expect(mockWebSocket.send).toHaveBeenCalledWith(
        expect.stringContaining('Successfully unsubscribed'),
      );
    });
  });
});
