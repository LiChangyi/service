/**
 * 连接 redis
 */
import {
  RedisClient, Multi, createClient, RedisError,
} from 'redis';
import { promisifyAll } from 'bluebird';

import logger from '../utils/logger';
import config from '../../config';

let client: RedisClient | null = null;

export default () => {
  if (client) {
    return client;
  }
  // 给 redis 添加 async 方法
  promisifyAll(RedisClient.prototype);
  promisifyAll(Multi.prototype);

  client = createClient({
    host: config.redis.host,
    password: config.redis.password,
  });
  client.on('connect', () => {
    logger.info('与 redis 连接成功');
  });
  client.on('error', (err: RedisError) => {
    logger.error('与 redis 连接失败');
    logger.error(err);
  });
  return client;
};
