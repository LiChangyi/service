import log4js from 'log4js';
import path from 'path';

import { FILE_SAVE_DIR } from '@/common/const';

// 日志保存天数
const daysToKeep = {
  info: 30,
  err: 30,
};

const loggerConfig = {
  pm2: true,
  replaceConsole: true,
  appenders: {
    stdout: {
      type: 'stdout',
    },
    info: {
      type: 'dateFile',
      filename: path.resolve(process.cwd(), FILE_SAVE_DIR.LOG_INFO_PATH),
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      daysToKeep: daysToKeep.info,
    },
    error: {
      type: 'dateFile',
      filename: path.resolve(process.cwd(), FILE_SAVE_DIR.LOG_ERROR_PATH),
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      daysToKeep: daysToKeep.err,
    },
  },
  categories: {
    info: { appenders: ['info', 'stdout'], level: 'info' },
    error: { appenders: ['error', 'info', 'stdout'], level: 'error' },
    default: { appenders: ['info', 'error', 'stdout'], level: 'trace' },
  },
};

log4js.configure(loggerConfig);

const infoLogger = log4js.getLogger('info');
const errorLogger = log4js.getLogger('error');

const logger: ILogger = {
  info: (text: string) => {
    if (text) {
      infoLogger.info(text);
    }
  },
  error: (error: any) => {
    if (typeof error === 'string') {
      errorLogger.error(error);
      return;
    }
    if (error) {
      const text = `
      ------------ error log start ------------
      error name   : ${error.name}\n
      error message: ${error.message}\n
      error stack  : ${error.stack}\n
      ------------- error log end -------------
      `;
      errorLogger.error(text);
    }
  },
};

export default logger;
