# Simple WS PubSub Server

A simple WebSocket PubSub server built with TypeScript. WS connections can `publish`, `subscribe`, or `unsubscribe` to different topics.

## Message Format

```
{
  msgType: publish | subscribe | unsubscribe;
  msg: string;
  topic: string;
}
```

## Sample Messages

##### Publish

```
{
  "msgType": "publish",
  "msg": "hey there",
  "topic": "topic_001"
}
```

##### Subscribe

```
{
  "msgType": "subscribe",
  "topic": "topic_001"
}
```

##### Unsubscribe

```
{
  "msgType": "unsubscribe",
  "topic": "topic_001"
}
```
