import KoaRouter from 'koa-router';

import validateMiddleWare from '@/middleware/validate';
import add from './add';
import remove from './remove';
import list from './list';
import update from './update';

const router = new KoaRouter({
  prefix: '/api/tag',
});

[add, remove, list, update].forEach(({
  method = 'get', path = '/', validate, handle,
}: IRouteConfig) => {
  router[method.toLocaleLowerCase()](path, validateMiddleWare(validate), handle);
});

export default router;
