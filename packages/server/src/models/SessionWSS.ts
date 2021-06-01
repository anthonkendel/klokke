import WebSocket from 'ws';

export interface KSessionWSS {
  webSocketServer: WebSocket.Server;
  webSockets: WebSocket[];
  numberOfConnections: number;
}
