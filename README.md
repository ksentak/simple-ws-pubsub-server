# WS PubSub TypeScript

A simple pub/sub server built with TypeScript. WS connections can `publish`, `subscribe`, or `unsubscribe` to different topics.

## Message Format

```
{
  id: string;
  msgType: publish | subscribe | unsubscribe;
  msg: string;
  topic: string;
}
```

## Sample Messages

##### Publish

```
{
  "id": "123",
  "msgType": "publish",
  "msg": "hey there",
  "topic": "random topic"
}
```

##### Subscribe

```
{
  "id": "456",
  "msgType": "subscribe",
  "topic": "random topic"
}
```

##### Unsubscribe

```
{
  "id": "789",
  "msgType": "unsubscribe",
  "topic": "random topic"
}
```
