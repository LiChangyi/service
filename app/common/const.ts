import os from 'os';

/**
 * 返回数据表对应，
 * [http状态码， 消息文本]
 */
export const RESPONSE_CODE_MAP: Record<string, [number, string]> = {
  PARAMS_ERROR: [400, '参数错误'],
  USERNAME_EXIST: [400, 'username 已存在!'],
  PASSWORD_ERROR: [400, '账号密码错误'],
  OLD_PASSWORD_ERROR: [400, '原密码错误'],
  NEW_PASSWORD_ERROR: [400, '新密码不能为空'],
  NOT_SELECT_FILE: [400, '请选择需要上传的文件'],
  SELECT_MULTIPLE_FILE: [400, '请选择单个文件'],
  UNSUPPORTED_FILE_TYPE: [400, '不支持的文件类型，请重新选择文件'],
  FILE_NOT_EXISTENT: [400, '文件不存在'],
  NO_LOGIN: [401, '用户没有登录'],
  NO_AUTH: [403, '没有访问权限'],
  SERVER_INNER_ERROR: [500, '服务内部错误'],
};

// 密码 md5 加密的混淆, 防止代码泄露，从环境变量中读取
export const MD5_SUFFIX = process.env.BLOG_MD5_SUFFIX || '7C1AA485-02C6-4E51-B0EA-732920470685';
// jwt 生成 token 的 secret
export const TOKEN_SUFFIX = process.env.BLOG_TOKEN_SUFFIX || 'A24DC475-5D65-425D-8665-7010BE315D9E';
// token 的过期时间
export const TOKEN_EXPIRES = '30d';
// 密码输入错误的配置信息
export const PWD_ERROR = {
  count: 10,
  // 十分钟
  time: 600,
};
// 日志不打印请求体的安全的
export const NO_LOG_INTERFACE_LIST = [
  ['POST', '/api/user/token'],
];

// 各种目录
export const FILE_SAVE_DIR = {
  LOG_INFO_PATH: './logs/info/',
  LOG_ERROR_PATH: './logs/error/',
  // 上传文件生成的目录，所有上传的源文件，包括图片
  UPLOAD_FILE_PATH: `${os.homedir()}/data/file/`,
  // 图片转码后的目录，只包括转码后的图片
  UPLOAD_IMAGE_PATH: `${os.homedir()}/data/image/`,
};

export default {};
