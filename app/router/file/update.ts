import { Context } from 'koa';

import { RESPONSE_CODE_MAP } from '@/common/const';
import { getUpdateBasePath, imageTranscodeToWebp } from '@/utils/file';
import { updatePayload } from './paramsValidate';

export default <IRouteConfig> {
  path: '/:id',
  method: 'PATCH',
  validate: {
    auth: ['admin'],
    payload: updatePayload,
  },
  handle: async (ctx: Context) => {
    const { id } = ctx.params;
    const { transcode, remark } = ctx.request.body;

    const file = await ctx.models.File.findOne({ _id: id })
      .lean();
    if (!file) {
      ctx.error(RESPONSE_CODE_MAP.FILE_NOT_EXISTENT);
      return;
    }

    const update: any = {};
    if (remark && remark !== file.remark) {
      update.$set = {
        remark,
      };
    }

    // 转码判断
    const find = file.transcode.some((o) => o.type === transcode);
    if (!find) {
      if (
        file.type === 'image'
      && file.suffix !== 'webp'
      && transcode === 'webp'
      ) {
        const tFile = await imageTranscodeToWebp(`${getUpdateBasePath('image')}${file.filename}`, `${remark} webp 转码文件`);
        update.$addToSet = {
          transcode: {
            type: 'webp',
            info: tFile._id,
          },
        };
      }
    }

    if (Object.keys(update).length) {
      await ctx.models.File.updateOne({ _id: id }, { ...update });
    }
    ctx.success();
  },
};
