import { Schema, model } from 'mongoose';

const schema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  md5: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
  },
  suffix: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  transcode: {
    type: [
      {
        type: {
          type: String,
          required: true,
        },
        info: {
          type: Schema.Types.ObjectId,
          ref: 'File',
        },
      },
    ],
    default: [],
  },
  remark: {
    type: String,
    default: '',
  },
}, {
  versionKey: false,
  timestamps: true,
});

export default model<IFileDocument>('File', schema);
