import KoaRouter from 'koa-router';

import validateMiddleWare from '@/middleware/validate';
import upload from './upload';
import list from './list';
import remove from './remove';
import update from './update';

const router = new KoaRouter({
  prefix: '/api/file',
});

[upload, list, remove, update].forEach(({
  method = 'get', path = '/', validate, handle,
}: IRouteConfig) => {
  router[method.toLocaleLowerCase()](path, validateMiddleWare(validate), handle);
});

export default router;
