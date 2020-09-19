import fs from 'fs';
import crypto from 'crypto';
import fileType from 'file-type';
import { execFileSync } from 'child_process';

import models from '@/models';
import logger from '@/utils/logger';
import { FILE_SAVE_DIR } from './const';
import { genId } from './func';

export const getUpdateBasePath = (type) => (
  type === 'image' ? FILE_SAVE_DIR.UPLOAD_IMAGE_PATH : FILE_SAVE_DIR.UPLOAD_FILE_PATH
);

// 移动文件
export const moveFile = (path: string, filename: string, type: string) => {
  const newPath = `${getUpdateBasePath(type)}${filename}`;
  return new Promise<string>((resolve, reject) => {
    fs.rename(path, newPath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(newPath);
      }
    });
  });
};

// 删除文件
export const deleteFile = (type: string, filename: string) => new Promise((resolve, reject) => {
  fs.unlink(`${getUpdateBasePath(type)}${filename}`, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});

// 计算文件的 md5
export const calcFileMd5 = (path: string) => {
  const readStream = fs.createReadStream(path);
  const hashMd5 = crypto.createHash('md5');
  return new Promise<string>((resolve, reject) => {
    readStream.on('data', (data) => {
      hashMd5.update(data);
    });
    readStream.on('end', () => {
      resolve(hashMd5.digest('hex'));
    });
    readStream.on('error', (err) => {
      reject(err);
    });
  });
};

// 文件类型处理
export const handleFileType = async (path: string) => {
  const readStream = fs.createReadStream(path);
  const { mime } = await fileType.fromStream(readStream) || {};
  if (!mime) {
    return {
      type: '',
      suffix: '',
    };
  }
  const [type, suffix] = mime
    .toLowerCase()
    .split('/');

  // 目前只支持 image
  if (type !== 'image') {
    return {
      type: '',
      suffix: '',
    };
  }
  return {
    type,
    suffix,
  };
};

// 图片 webp 转码
export const imageTranscodeToWebp = async (sourcePath: string, remark: string) => {
  const filename = `${genId()}.webp`;
  const targetPath = `${FILE_SAVE_DIR.UPLOAD_IMAGE_PATH}${filename}`;
  execFileSync('cwebp', [sourcePath, '-o', targetPath]);
  const md5 = await calcFileMd5(targetPath);
  const find = await models.File.findOne({ md5 });
  if (find) {
    // 存在已经转义过了，需要把当前的转码删掉节约存储空间
    await deleteFile('image', filename);
    logger.info(`已存在文件：${targetPath}`);
    return find;
  }
  const { size } = fs.statSync(targetPath);
  const file = new models.File({
    filename,
    md5,
    type: 'image',
    suffix: 'webp',
    transcode: [],
    size,
    remark,
  });
  await file.save();
  return file;
};

export default {};
