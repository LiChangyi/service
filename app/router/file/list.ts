import { Context } from 'koa';

import { listQuery } from './paramsValidate';

export default <IRouteConfig> {
  method: 'GET',
  path: '/list',
  validate: {
    auth: ['admin'],
    query: listQuery,
  },
  handle: async (ctx: Context) => {
    const {
      page, size, createdAt, updatedAt, keywords,
    } = ctx.formatQuery;
    const query: any = {};
    if (keywords) {
      query.remark = {
        $regex: keywords,
      };
    }

    if (createdAt.length) {
      query.createdAt = {
        $gte: createdAt[0],
        $lte: createdAt[1],
      };
    }

    if (updatedAt.length) {
      query.updatedAt = {
        $gte: updatedAt[0],
        $lte: updatedAt[1],
      };
    }

    const list = await ctx.models.File.find(query)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * size)
      .limit(size)
      .populate([
        {
          path: 'transcode.info',
        },
      ])
      .lean();

    const count = await ctx.models.File.countDocuments(query);
    ctx.success({
      list,
      count,
    });
  },
};
