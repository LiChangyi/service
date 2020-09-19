import { Context } from 'koa';
import fs from 'fs';
import _ from 'lodash';

import { RESPONSE_CODE_MAP } from '@/common/const';
import {
  calcFileMd5, handleFileType, imageTranscodeToWebp, moveFile,
} from '@/common/file';

import { genId } from '@/common/func';
import { uploadPayload } from './paramsValidate';

export default <IRouteConfig> {
  method: 'POST',
  path: '/upload',
  validate: {
    auth: ['admin'],
    payload: uploadPayload,
  },
  handle: async (ctx: Context) => {
    const { transcode } = ctx.request.body;

    const file = _.get(ctx.request.files, 'files', null);
    if (!file) {
      ctx.error(RESPONSE_CODE_MAP.NOT_SELECT_FILE);
      return;
    }
    if (Array.isArray(file)) {
      ctx.error(RESPONSE_CODE_MAP.SELECT_MULTIPLE_FILE);
      return;
    }

    // 识别文件类型
    const { type, suffix } = await handleFileType(file.path);
    if (!type) {
      ctx.error(RESPONSE_CODE_MAP.UNSUPPORTED_FILE_TYPE);
      return;
    }
    // md5 校验
    const md5 = await calcFileMd5(file.path);
    const findFile = await ctx.models.File
      .findOne({ md5 });
    if (findFile) {
      ctx.success({
        file: findFile.toObject(),
      });
      return;
    }

    const remark = ctx.request.body.remark || file.name;
    const filename = `${genId()}.${suffix}`;
    const newFilePath = await moveFile(file.path, filename, type);
    const { size } = fs.statSync(newFilePath);
    // 不存在文件，需要新建和保存文件等
    const newFile = new ctx.models.File({
      filename,
      md5,
      type,
      suffix,
      remark,
      size,
      transcode: [],
    });

    // 目前仅支持对图片进行 webp 转码
    if (
      type === 'image'
      && suffix !== 'webp'
      && transcode === 'webp'
    ) {
      const tFile = await imageTranscodeToWebp(newFilePath, `${remark} webp 转码文件`);
      newFile.transcode.push({
        type: 'webp',
        info: tFile._id,
      });
    }

    await newFile.save();
    ctx.success(newFile);
  },
};
