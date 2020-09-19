import { TypeApp } from 'koa';
import koaBody from 'koa-body';

import httpLog from './httpLog';
import response from './response';

export default (app: TypeApp) => {
  app.use(
    koaBody({
      formLimit: '10mb',
      jsonLimit: '10mb',
      textLimit: '10mb',
      multipart: true,
      formidable: {
        maxFileSize: 50 * 1024 * 1024,
      },
    }),
  );
  app.use(httpLog);
  app.use(response);
};
