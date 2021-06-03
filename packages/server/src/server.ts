import cors from '@koa/cors';
import KoaRouter from '@koa/router';
import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import { name } from '../package.json';
import { Logger } from './models/Logger';
import { KSession } from './models/Session';

const logger = new Logger();

const port = process.env.PORT ? Number(process.env.PORT) : 5050;
const host = process.env.HOST ?? '0.0.0.0';

const server = new Koa();
const router = new KoaRouter();

server.use(bodyparser());
server.use(cors());
server.use(router.routes());
server.use(router.allowedMethods());

server.listen(port, host, undefined, () => logger.info(`${name} listening on ${host}:${port}`));

type Key = string;

const SESSIONS: Record<Key, KSession> = {};

router.post('/session', (ctx) => {
  const session = new KSession();
  logger.debug(`creating session ${session.key}`);
  SESSIONS[session.key] = session;
  ctx.body = session.data;
});

router.delete('/session/:key', (ctx) => {
  const key = ctx.params.key;
  logger.debug(`deleting session ${key}`);
  const session = SESSIONS[key];
  delete SESSIONS[key];

  ctx.status = 200;
  if (session) session.closeConnections();
});

router.all('/session-ws/:key', async (ctx, next) => {
  const key = ctx.params.key;
  const session = SESSIONS[key];
  const upgrade = ctx.headers.upgrade;

  if (upgrade?.includes('websocket') && session) {
    session.handleUpgrade(ctx.req, ctx.req.socket);
    ctx.respond = false;
  }

  await next();
});
