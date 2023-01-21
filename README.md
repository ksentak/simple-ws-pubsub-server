# WS PubSub TypeScript

## Sample Messages

##### Publish

```
{
  "id": "123",
  "msgType": "publish",
  "msg": "hey there",
  "topic": "testTopic"
}
```

##### Subscribe

```
{
  "id": "456",
  "msgType": "subscribe",
  "topic": "testTopic"
}
```

##### Unsubscribe

```
{
  "id": "789",
  "msgType": "unsubscribe",
  "topic": "testTopic"
}
```
