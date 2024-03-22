import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
import { WsMsg } from '../interfaces/ws';

/**
 * Safely sends a WebSocket message, catching and logging any errors that occur.
 * @param {WebSocket} ws - The WebSocket connection to send the message on.
 * @param {Object} payload - The message payload to send.
 * @param {Function} [errorCallback] - An optional callback to execute in case of an error.
 */
const safeSend = (ws, payload, errorCallback?) => {
  try {
    ws.send(JSON.stringify(payload));
  } catch (error) {
    console.error('Error sending WebSocket message:', error);
    if (typeof errorCallback === 'function') {
      errorCallback(error);
    }
  }
};

/**
 * Publishes a message to all listeners of a given topic.
 * @param {WebSocket} ws - The WebSocket connection of the publisher.
 * @param {string} msg - The message content to publish.
 * @param {string} topic - The topic to publish the message to.
 * @param {Map} listeners - A Map of topic listeners.
 */
const publishMsg = (ws, msg, topic, listeners) => {
  const publishPayload: WsMsg = {
    id: uuidv4(),
    msg,
    msgType: 'publish',
    topic,
    timestamp: DateTime.now().toISO(),
  };

  const responsePayload: WsMsg = {
    id: uuidv4(),
    msg: `Successfully published message to ${topic}`,
    msgType: 'serverResponse',
    topic,
    timestamp: DateTime.now().toISO(),
  };

  // Check is the topic exists and has listeners
  if (listeners.has(topic) && listeners.get(topic).size > 0) {
    listeners.get(topic).forEach((listener) => {
      safeSend(listener, publishPayload);
    });

    safeSend(ws, responsePayload);
  } else {
    responsePayload.msg =
      'Error trying to send msg. The topic you are sending a msg to must have active listeners';

    safeSend(ws, responsePayload);
  }
};

/**
 * Subscribes a WebSocket connection to a specified topic.
 * @param {WebSocket} ws - The WebSocket connection to subscribe.
 * @param {string} topic - The topic to subscribe to.
 */
const subscribeToTopic = (ws, topic) => {
  const payload = {
    id: uuidv4(),
    msg: `Successfully subscribed to topic ${topic}`,
    msgType: 'serverResponse',
    topic,
    timestamp: DateTime.now().toISO(),
  };

  safeSend(ws, payload);
};

/**
 * Unsubscribes a WebSocket connection from a specified topic.
 * @param {WebSocket} ws - The WebSocket connection to unsubscribe.
 * @param {string} topic - The topic to unsubscribe from.
 */
const unsubscribeFromTopic = (ws, topic) => {
  const payload = {
    id: uuidv4(),
    msg: `Successfully unsubscribed from topic ${topic}`,
    msgType: 'serverResponse',
    topic,
    timestamp: DateTime.now().toISO(),
  };

  safeSend(ws, payload);
};

export { publishMsg, subscribeToTopic, unsubscribeFromTopic };
