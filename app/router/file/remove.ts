import { RESPONSE_CODE_MAP } from '@/common/const';
import { deleteFile } from '@/utils/file';
import { Context } from 'koa';

export default <IRouteConfig> {
  path: '/:id',
  method: 'DELETE',
  validate: {
    auth: ['admin'],
  },
  handle: async (ctx: Context) => {
    const { id } = ctx.params;
    const find = await ctx.models.File.findOne({ _id: id });
    if (!find) {
      ctx.error(RESPONSE_CODE_MAP.FILE_NOT_EXISTENT);
      return;
    }
    await find.deleteOne();
    // 删除文件
    await deleteFile(find.type, find.filename);
    ctx.success({
      success: true,
    });
  },
};
