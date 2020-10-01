import { RESPONSE_CODE_MAP } from '@/common/const';
import { Context } from 'koa';
import { payload } from './paramsValidate';

export default <IRouteConfig> {
  path: '/',
  method: 'POST',
  validate: {
    auth: ['admin'],
    payload,
  },
  handle: async (ctx: Context) => {
    const {
      name,
      description,
    } = ctx.request.body;

    // name 存在
    const exist = await ctx.models.Tag.findOne({ name })
      .lean();
    if (exist) {
      ctx.error(RESPONSE_CODE_MAP.NAME_EXIST);
      return;
    }
    // 不存在写库
    await ctx.models.Tag.create({
      name,
      description,
    });
    ctx.success();
  },
};
