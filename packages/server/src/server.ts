import KoaRouter from '@koa/router';
import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import cors from '@koa/cors';
import { name } from '../package.json';
import { Logger } from './logger';
import { generatePetname } from 'javascript-petname';

const logger = new Logger();

const port = process.env.PORT ? Number(process.env.PORT) : 5050;
const host = process.env.HOST ?? 'localhost';

const server = new Koa();
const router = new KoaRouter();

server.use(bodyparser());
server.use(cors());
server.use(router.routes());
server.use(router.allowedMethods());

server.listen(port, host, undefined, () => logger.info(`${name} listening on ${host}:${port}`));

type Key = string;

type SSession = {
  key: Key;
  elapsedInMs: number;
};

const SESSIONS: Record<Key, SSession> = {};
const INTERVALS: Record<Key, NodeJS.Timeout> = {};

router.post('/stopwatch', (ctx) => {
  const key = generatePetname({ words: 2, separator: '-' });

  const session = {
    key,
    elapsedInMs: 0,
  };
  SESSIONS[key] = session;

  ctx.body = session;
});

router.get('/stopwatch/:key', (ctx) => {
  const key = ctx.params.key;
  const current = SESSIONS[key];

  if (!current) {
    ctx.status = 404;
    return;
  }

  ctx.body = current;
});

router.patch('/stopwatch/:key', (ctx) => {
  const key = ctx.params.key;
  const current = SESSIONS[key];
  const action = ctx.request.body?.action;

  if (!current) {
    ctx.status = 404;
    return;
  }

  if (typeof action !== 'string') {
    ctx.status = 404;
    return;
  }

  const actionLowercase = action.toLowerCase();
  const intervalMs = 100;
  const interval = INTERVALS[key];

  if (actionLowercase === 'start') {
    logger.info('start');
    INTERVALS[key] = setInterval(() => {
      current.elapsedInMs = current.elapsedInMs + intervalMs;
    }, intervalMs);
  }

  if (actionLowercase === 'stop' && interval) {
    logger.info('stop');
    clearInterval(interval);
  }

  ctx.body = current;
});
