import Koa, { Context } from 'koa';
import { RedisClient } from 'redis';

declare module 'koa' {
  interface BaseContext {
    logger: ILogger;
    models: IModels,
    redis: RedisClient,
    user: TCtxUser,
    formatQuery: any;
    success: (data?) => void;
    error: (response: [number, string]) => void;
  }
  type TypeApp = Koa<Koa.DefaultState, Koa.DefaultContext>;
}
