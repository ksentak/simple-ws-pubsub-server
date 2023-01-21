import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
import { wsMsg } from '../interfaces/wsMsg';

const publishMsg = (ws, msg, topic) => {
  const payload: wsMsg = {
    id: uuidv4(),
    msg,
    msgType: 'publish',
    topic,
    timestamp: DateTime.now(),
  };
  ws.send(JSON.stringify(payload));
};

const subscribeToTopic = (ws, topic, listeners) => {};

const unsubscribeFromTopic = (ws, topic, listeners) => {};

export { publishMsg, subscribeToTopic, unsubscribeFromTopic };
