import { Schema, model } from 'mongoose';

const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
    },
  ],
  status: {
    type: Number,
    default: 1,
  },
  recommend: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<IArticleDocument>('Article', schema);
