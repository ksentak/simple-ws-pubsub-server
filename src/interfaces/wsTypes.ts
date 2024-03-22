import { WebSocket } from 'ws';

export interface WsMsg {
  msgType: 'publish' | 'subscribe' | 'unsubscribe' | 'acknowledgment' | 'error';
  msg?: string;
  topic: string;
  timestamp?: string;
}

export interface Socket extends WebSocket {
  isAlive: boolean;
}
