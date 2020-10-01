import { Context } from 'koa';

export default <IRouteConfig> {
  path: '/',
  method: 'GET',
  validate: {
    auth: ['admin'],
  },
  handle: async (ctx: Context) => {
    // 先获取全量的标签
    const tags = await ctx.models.Tag.find({})
      .lean();
    // 然后获取文章对应的标签数目
    // const num = await ctx.models.Article.aggregate([
    //   {

    //   },
    // ]);
    ctx.success(tags);
  },
};
