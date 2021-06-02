import { IncomingMessage } from 'http';
import { generatePetname } from 'javascript-petname';
import { Socket } from 'net';
import WebSocket from 'ws';
import { KAction } from './Action';
import { Logger } from './Logger';
import { KMessage } from './Message';
import { KSessionData } from './SessionData';
import { KSessionTimer } from './SessionTimer';
import { KSessionWSS } from './SessionWSS';

export class KSession implements KSessionData, KSessionWSS, KSessionTimer {
  private readonly timerMs = 100;
  private readonly logger = new Logger();

  key: string;
  timestamp: number;
  timer?: NodeJS.Timeout;
  webSocketServer: WebSocket.Server;
  webSockets: WebSocket[] = [];

  constructor() {
    this.key = generatePetname({ words: 2, separator: '-' });
    this.timestamp = 0;
    this.webSocketServer = new WebSocket.Server({ noServer: true });
  }

  get numberOfConnections(): number {
    return this.webSockets.length;
  }

  get data(): KSessionData {
    return {
      key: this.key,
      timestamp: this.timestamp,
    };
  }

  get stringifiedData(): string {
    return JSON.stringify(this.data);
  }

  handleUpgrade(request: IncomingMessage, socket: Socket): void {
    this.webSocketServer.handleUpgrade(request, socket, Buffer.alloc(0), (ws) => {
      this.addWebSocket(ws);
      ws.send(this.stringifiedData);
      ws.on('open', () => this.onOpen(ws));
      ws.on('close', (code, reason) => this.onClose(ws, code, reason));
      ws.on('message', (data) => this.onMessage(ws, data));
      ws.on('error', (error) => this.onError(ws, error));
    });
  }

  resetTimestamp(): void {
    this.timestamp = 0;
  }

  startTimer(): void {
    if (this.timer) return;

    this.timer = setInterval(() => {
      this.timestamp += this.timerMs;
      this.webSockets.forEach((ws) => ws.send(JSON.stringify(this.data)));
    }, this.timerMs);
  }

  pauseTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  closeConnections(): void {
    this.logger.debug('closing web sockets');
    this.webSockets.forEach((socket) => socket.close());
    this.logger.debug('closing web socket server');
    this.webSocketServer.close();
  }

  private addWebSocket(ws: WebSocket): void {
    const existingWebSocket = this.webSockets.find((socket) => socket === ws);
    if (!existingWebSocket) {
      this.webSockets.push(ws);
      this.logger.debug('ws:connections', this.numberOfConnections);
    }
  }

  private removeWebSocket(ws: WebSocket): void {
    const webSocketIndex = this.webSockets.findIndex((socket) => socket === ws);
    if (webSocketIndex >= 0) {
      this.webSockets.splice(webSocketIndex, 1);
      this.logger.debug('ws:connections', this.numberOfConnections);

      if (this.numberOfConnections === 0) {
        this.logger.info('there is no connections left, stopping and resetting timer');
        this.pauseTimer();
        this.resetTimestamp();
      }
    }
  }

  private onOpen(ws: WebSocket): void {
    this.logger.debug('ws:open');
  }

  private onClose(ws: WebSocket, code: number, reason: string): void {
    this.logger.debug('ws:close');
    this.removeWebSocket(ws);
  }

  private onMessage(ws: WebSocket, data: WebSocket.Data): void {
    this.logger.debug('ws:message', data.toString());
    const message = JSON.parse(data.toString()) as KMessage;

    switch (message.action) {
      case KAction.StartTimer:
        this.startTimer();
        ws.send(this.stringifiedData);
        break;

      case KAction.PauseTimer:
        this.pauseTimer();
        ws.send(this.stringifiedData);
        break;

      case KAction.ResetTimer:
        this.pauseTimer();
        this.resetTimestamp();
        ws.send(this.stringifiedData);
        break;

      default:
        break;
    }
  }

  private onError(ws: WebSocket, error: Error): void {
    this.logger.debug('ws:error');
    this.logger.debug(error);
    this.logger.info('something went wrong, stopping and resetting timer');
    this.pauseTimer();
    this.resetTimestamp();
  }
}
