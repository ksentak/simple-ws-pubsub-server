import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
import { WsMsg } from '../interfaces/ws';

const publishMsg = (ws, msg, topic, listeners) => {
  const publishPayload: WsMsg = {
    id: uuidv4(),
    msg,
    msgType: 'publish',
    topic,
    timestamp: DateTime.now(),
  };

  const responsePayload: WsMsg = {
    id: uuidv4(),
    msg: `Successfully published message to ${topic}`,
    msgType: 'serverResponse',
    topic,
    timestamp: DateTime.now(),
  };

  if (Array.isArray(listeners[topic]) && listeners[topic].length > 0) {
    listeners[topic].forEach((listener) => {
      listener.send(JSON.stringify(publishPayload));
    });

    ws.send(JSON.stringify(responsePayload));
  } else {
    responsePayload.msg =
      'Error trying to send msg. The topic you are sending a msg to must have active listeners';

    ws.send(JSON.stringify(responsePayload));
  }
};

const subscribeToTopic = (ws, topic) => {
  const payload = {
    id: uuidv4(),
    msg: `Successfully subscribed to topic ${topic}`,
    msgType: 'serverResponse',
    topic,
    timestamp: DateTime.now(),
  };

  ws.send(JSON.stringify(payload));
};

const unsubscribeFromTopic = (ws, topic) => {
  const payload = {
    id: uuidv4(),
    msg: `Successfully unsubscribed from topic ${topic}`,
    msgType: 'serverResponse',
    topic,
    timestamp: DateTime.now(),
  };

  ws.send(JSON.stringify(payload));
};

export { publishMsg, subscribeToTopic, unsubscribeFromTopic };
