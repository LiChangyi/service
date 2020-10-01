import { Document, Model, Types } from 'mongoose';

declare global {
  interface IUser {
    _id: Types.ObjectId;
    username: string;
    nickname: string;
    password: string;
    role?: 'admin' | 'user';
  }
  interface IUserDocument extends Document, IUser {}

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
  interface IFileDocument extends Document, IFile {}

  interface ITag {
    name: string;
    description: string;
  }
  interface ITagDocument extends Document, ITag {}

  interface IArticle {
    title: string;
    content: string;
    description: string;
    tags: [ITag];
    status: number;
    recommend: boolean;
    cover: string;
    createdAt: Date;
  }
  interface IArticleDocument extends Document, IArticle {}

  interface IModels {
    User: Model<IUserDocument>;
    File: Model<IFileDocument>;
    Tag: Model<ITagDocument>;
    Article: Model<IArticleDocument>;
  }
}
