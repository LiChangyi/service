import { Context } from 'koa';

const route: IRouteConfig = {
  method: 'GET',
  path: '/',
  validate: {
    auth: ['user', 'admin'],
  },
  handle: async (ctx: Context) => {
    const { uid } = ctx.user;
    const user = await ctx.models.User.findById(uid, {
      password: 0,
    });
    ctx.body = user;
  },
};

export default route;
