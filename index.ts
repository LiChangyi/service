import Koa from 'koa';

import '@/lib/beforeStart';
import logger from './app/utils/logger';
import bindRouter from './app/router';
import bindMiddleWare from './app/middleware';
import config from './config';
import mongodb from './app/lib/mongodb';
import models from './app/models';
import redis from './app/lib/redis';

const app = new Koa();
app.context.logger = logger;
app.context.models = models;

app.env = process.env.NODE_ENV || app.env;

// 连接数据库
mongodb();

// 连接 redis
app.context.redis = redis();

// 绑定中间件
bindMiddleWare(app);

// 绑定路由信息
bindRouter(app);

console.log(`服务已启动：http://127.0.0.1:${config.port}`);
app.listen(config.port);
