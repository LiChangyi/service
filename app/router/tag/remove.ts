import { Context } from 'koa';

export default <IRouteConfig> {
  path: '/:id',
  method: 'DELETE',
  validate: {
    auth: ['admin'],
  },
  handle: async (ctx: Context) => {
    const tagId = ctx.params.id;
    await ctx.models.Tag.deleteOne({
      _id: tagId,
    });
    ctx.success();
  },
};
