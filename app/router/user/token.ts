import { Context } from 'koa';

import { tokenPayload } from './paramsValidate';
import { PWD_ERROR } from '../../common/const';
import { convertTime, md5, createToken } from '../../common/func';

const route: IRouteConfig = {
  method: 'post',
  path: '/token',
  validate: {
    payload: tokenPayload,
  },
  handle: async (ctx: Context) => {
    const { username, password } = ctx.request.body;

    const redisKey = `loginFail:${ctx.ip}`;
    // 获取登录失败的次数
    const str = await ctx.redis.getAsync(redisKey) || '';
    const [time, count = 0] = str.split(':');
    if (count >= PWD_ERROR.count) {
      ctx.error([400, `登录失败次数已经超过${count}次，请${convertTime(Number(time), PWD_ERROR.time)}过后再次尝试`]);
      return;
    }
    const user = await ctx.models.User.findOne({
      username,
      password: md5(password),
    }, {
      password: 0,
    })
      .lean();

    if (!user) {
      // 设置失败次数 和 当前的时间
      await ctx.redis.setAsync(redisKey, `${Date.now()}:${Number(count) + 1}`, 'EX', PWD_ERROR.time);
      ctx.error([400, `用户名或者密码错误,你还有${PWD_ERROR.count - Number(count) - 1}次机会`]);
      return;
    }
    // 生成 token
    const token = await createToken(user);
    ctx.body = {
      ...user,
      token,
    };
  },
};

export default route;
