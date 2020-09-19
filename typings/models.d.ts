import { Document, Model, Types } from 'mongoose';

declare global {
  interface IUser {
    _id: Types.ObjectId;
    username: string;
    nickname: string;
    password: string;
    role?: 'admin' | 'user';
  }
  interface IUserDocument extends Document, IUser {

  }
  interface IFile {
    _id: Types.ObjectId;
    size: number;
    filename: string;
    md5: string;
    type: string;
    suffix: string;
    transcode: {
      type: string;
      info: Types.ObjectId;
    }[],
    remark?: string;
  }
  interface IFileDocument extends Document, IFile {

  }
  type IUserModel = Model<IUserDocument>;
  interface IModels {
    User: IUserModel;
    File: Model<IFileDocument>
  }
}
