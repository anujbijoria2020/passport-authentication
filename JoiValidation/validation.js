const Joi = require("joi");

const signupSchema = Joi.object({
  email: Joi.string()
    .email({
      tlds: { allow: ["com", "net"] },
    })
    .min(8)
    .max(50)
    .required(),

  password: Joi.string()
    .min(8)
    .max(50)
    .required(),

  firstName: Joi.string()
    .min(2) // changed from 8 to 2
    .max(50)
    .required(),

  lastName: Joi.string()
    .min(2) // changed from 8 to 2
    .max(50)
    .required(),
});
const loginSchema = Joi.object({
      email: Joi.string()
    .email({
      tlds: { allow: ["com", "net"] },
    })
    .min(8)
    .max(50)
    .required(),

  password: Joi.string()
    .min(8)
    .max(50)
    .required(),
})
module.exports = {signupSchema,loginSchema};
