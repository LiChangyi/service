import { Context } from 'koa';

export default {
  success(ctx: Context, data = { message: 'success' }) {
    ctx.status = 200;
    ctx.body = data;
  },
  error(ctx: Context, response: [number, string]) {
    const [code, message] = response;
    ctx.status = code;
    ctx.body = {
      code,
      request: `${ctx.method} ${ctx.path}`,
      message,
    };
  },
};
