import KoaRouter from 'koa-router';

import validateMiddleWare from '../../middleware/validate';
import token from './token';
import detail from './detail';
import update from './update';

const router = new KoaRouter({
  prefix: '/api/user',
});

[token, detail, update].forEach(({
  method = 'get', path = '/', validate, handle,
}: IRouteConfig) => {
  router[method.toLocaleLowerCase()](path, validateMiddleWare(validate), handle);
});

export default router;
