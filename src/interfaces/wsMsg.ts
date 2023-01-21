export interface wsMsg {
  id: string;
  msgType: string;
  msg?: string;
  topic: string;
  timestamp?: string;
}
