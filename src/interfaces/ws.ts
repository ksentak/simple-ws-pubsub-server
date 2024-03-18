import { WebSocket } from 'ws';

export interface WsMsg {
  id: string;
  msgType: string;
  msg?: string;
  topic: string;
  timestamp?: string;
}

export interface Socket extends WebSocket {
  isAlive: boolean;
}
