import _ from 'lodash';
import { Context } from 'koa';
import { ValidationError } from 'joi';

import { RESPONSE_CODE_MAP, TOKEN_REFRESH_DDL } from '@/common/const';
import { createToken, validateToken } from '@/utils/func';
import { isTCtxUser } from '@/common/isType';

const authValidate = async (ctx: Context, auth: TRole[]): Promise<Boolean> => {
  const token = ctx.get('token');
  if (!token) {
    return false;
  }
  const res = await validateToken(token, auth);
  if (isTCtxUser(res)) {
    // 如果快要过期了，更新 token
    if ((res.exp - Date.now() / 1000) <= TOKEN_REFRESH_DDL) {
      const newToken = await createToken({
        _id: res.uid,
        nickname: res.nickname,
        role: res.role,
      });
      ctx.append('refreshToken', newToken);
    }
    ctx.user = res;
    return true;
  }
  return false;
};

export default (validate: IRouteConfig['validate']): any => async (ctx: Context, next: any) => {
  const payload = validate?.payload || null;
  const query = validate?.query || null;
  const auth = validate?.auth || [];

  // 校验权限
  if (auth.length) {
    const hasAuth = await authValidate(ctx, auth);
    if (!hasAuth) {
      ctx.error(RESPONSE_CODE_MAP.NO_LOGIN);
      return;
    }
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
