/**
 * APP 启动前做的一些事情
 */

import fs from 'fs';
import { FILE_SAVE_DIR } from '@/common/const';

// 判断文件是否存在，不存在则创建
const confirmPath = (pathStr: string) => {
  if (!fs.existsSync(pathStr)) {
    fs.mkdirSync(pathStr, { recursive: true });
    console.log(`成功创建文件夹: ${pathStr}`);
  } else {
    console.log(`文件夹已存在：${pathStr}`);
  }
};

const beforeStart = () => {
  console.log('------------------- 开始进行 beforeStart -------------------');
  // 创建各种目录
  Object.values(FILE_SAVE_DIR)
    .forEach((path) => {
      confirmPath(path);
    });

  console.log('------------------- 完成执行 beforeStart -------------------');
};

beforeStart();
