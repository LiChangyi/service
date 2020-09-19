import { Context } from 'koa';
import { md5 } from '@/common/func';
import { RESPONSE_CODE_MAP } from '@/common/const';
import { updatePayload } from './paramsValidate';

export default <IRouteConfig> {
  method: 'PATCH',
  path: '/',
  validate: {
    auth: ['user', 'admin'],
    payload: updatePayload,
  },
  handle: async (ctx: Context) => {
    const {
      nickname,
      oldPassword,
      newPassword,
    } = ctx.request.body;
    const { uid } = ctx.user;

    if (!nickname && !oldPassword) {
      ctx.error(RESPONSE_CODE_MAP.PARAMS_ERROR);
      return;
    }

    const payload: {
      nickname?: string;
      password?: string;
    } = {};
    // 如果是修改密码
    if (oldPassword) {
      if (!newPassword) {
        ctx.error(RESPONSE_CODE_MAP.NEW_PASSWORD_ERROR);
        return;
      }
      // 判断原密码是否正确
      const user = await ctx.models.User.findOne({
        _id: uid,
        password: md5(oldPassword),
      });
      if (!user) {
        ctx.error(RESPONSE_CODE_MAP.OLD_PASSWORD_ERROR);
        return;
      }
      payload.password = md5(newPassword);
    }

    // 如果是修改 nickname
    if (nickname) {
      payload.nickname = nickname;
    }

    // 修改数据
    await ctx.models.User.updateOne({
      _id: uid,
    }, {
      $set: payload,
    });
    ctx.success();
  },
};
