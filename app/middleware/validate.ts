import _ from 'lodash';
import { Context } from 'koa';
import { ValidationError } from 'joi';

import { RESPONSE_CODE_MAP } from '../common/const';
import { validateToken } from '../common/func';

const authValidate = async (ctx: Context, auth: TRole[]): Promise<Boolean | TCtxUser> => {
  const token = ctx.get('token');
  if (!token) {
    ctx.error(RESPONSE_CODE_MAP.NO_LOGIN);
    return false;
  }
  const res = await validateToken(token, auth);
  return res;
};

export default (validate: IRouteConfig['validate']): any => async (ctx: Context, next: any) => {
  const payload = validate?.payload || null;
  const query = validate?.query || null;
  const auth = validate?.auth || [];

  // 校验权限
  if (auth.length) {
    const ctxUser = await authValidate(ctx, auth);
    if (!ctxUser) {
      return;
    }
    ctx.user = ctxUser as TCtxUser;
  }

  // 参数校验
  let error: ValidationError | null = null;
  if (query) {
    const res = query.validate(ctx.query);
    error = res.error;
    ctx.formatQuery = res.value;
  }
  if (payload) {
    const { body } = ctx.request;
    const res = payload.validate(body);
    error = res.error;
    ctx.request.body = res.value;
  }

  if (error) {
    const message = _.get(error, 'details[0].message', '参数校验失败');
    ctx.error([400, message]);
    return;
  }
  await next();
};
