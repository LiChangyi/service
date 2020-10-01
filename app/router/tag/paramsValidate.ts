import joi from 'joi';

const name = joi.string()
  .min(1)
  .max(20)
  .required();

const description = joi.string()
  .min(1)
  .max(50)
  .allow('')
  .default('');

export const payload = joi.object({
  name,
  description,
});

export default {};
