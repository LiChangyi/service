import { TypeApp } from 'koa';

import user from './user';
import file from './file';
import tag from './tag';

export default (app: TypeApp) => {
  app.use(user.routes());
  app.use(file.routes());
  app.use(tag.routes());
};
