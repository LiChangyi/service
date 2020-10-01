import { Schema, model } from 'mongoose';

import { md5 } from '@/utils/func';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
});

userSchema.pre('validate', function (this: IUserDocument, next: Function) {
  // 密码进行 加密
  this.password = md5(this.password);
  next();
});

export default model<IUserDocument>('User', userSchema);
