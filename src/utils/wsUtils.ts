import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
import { wsMsg } from '../interfaces/wsMsg';

const publishMsg = (ws, msg, topic, listeners) => {
  const payload: wsMsg = {
    id: uuidv4(),
    msg,
    msgType: 'publish',
    topic,
    timestamp: DateTime.now(),
  };
  ws.send(JSON.stringify(payload));
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
