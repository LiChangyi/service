import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';

import { MD5_SUFFIX, TOKEN_SUFFIX, TOKEN_EXPIRES } from './const';

// 用户密码 md5 加密
export const md5 = (str: string) => {
  const hash = createHash('md5');
  hash.update(str + MD5_SUFFIX);
  return hash.digest('hex');
};

// 转变时间
export const convertTime = (startAt: number, interval: number): string => {
  const nowAt: number = Date.now();
  // 获取的是 ms，需要转换
  const remain: number = Number(startAt) + (interval * 1000) - nowAt;
  return `${Math.round(remain / 1000)}s`;
};

// 生成 token
export const createToken = async (user: IUser) => {
  const token = await jwt.sign({
    uid: user._id,
    role: user.role,
    nickname: user.nickname,
  }, TOKEN_SUFFIX, {
    expiresIn: TOKEN_EXPIRES,
  });
  return token;
};
// 校验 token
export const validateToken = async (token: string, auth: TRole[]): Promise<Boolean | TCtxUser> => {
  try {
    const ctxUser: TCtxUser = await jwt.verify(token, TOKEN_SUFFIX);
    if (!auth.includes(ctxUser.role)) {
      return false;
    }
    return ctxUser;
  } catch (err) {
    // noop
  }
  return false;
};

// 生成 id, 类型 202009101130111 + 四位随机字符串
export const genId = () => {
  const randomStr = Math.random()
    .toFixed(4)
    .slice(2);
  return `${dayjs()
    .format('YYYYMMDDHHmmssSSS')}${randomStr}`;
};

export default {};
