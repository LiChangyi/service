import { RESPONSE_CODE_MAP } from '@/common/const';
import { Context } from 'koa';
import { payload } from './paramsValidate';

export default <IRouteConfig> {
  path: '/:id',
  method: 'PATCH',
  validate: {
    auth: ['admin'],
    payload,
  },
  handle: async (ctx: Context) => {
    const tagId = ctx.params.id;
    const {
      name,
      description,
    } = ctx.request.body;

    // name 存在
    const exist = await ctx.models.Tag.findOne({ _id: { $ne: tagId }, name });
    if (exist) {
      ctx.error(RESPONSE_CODE_MAP.NAME_EXIST);
      return;
    }
    // 不存在写库
    const tag = await ctx.models.Tag.findOneAndUpdate(
      {
        _id: tagId,
      }, {
        name,
        description,
      }, {
        new: true,
      },
    )
      .lean();
    ctx.success(tag);
  },
};
