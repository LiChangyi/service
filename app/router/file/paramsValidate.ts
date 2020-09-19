import joi from 'joi';

const transcode = joi.string()
  .valid('webp')
  .default('');

const remark = joi.string()
  .min(2)
  .max(20)
  .default('');

export const uploadPayload = joi.object({
  transcode,
  remark,
});

export const updatePayload = uploadPayload;

export const listQuery = joi.object({
  page: joi.number()
    .min(1)
    .default(1),
  size: joi.number()
    .min(10)
    .max(50)
    .default(10),
  keywords: joi.string()
    .default(''),
  createdAt: joi.array()
    .items(joi.date())
    .length(2)
    .default([]),
  updatedAt: joi.array()
    .items(joi.date())
    .length(2)
    .default([]),
});

export default {};
