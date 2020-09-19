import { TypeApp } from 'koa';

import user from './user';
import file from './file';

export default (app: TypeApp) => {
  app.use(user.routes());
  app.use(file.routes());
};
