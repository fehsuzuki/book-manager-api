const joi = require("joi");

const userSchema = joi.object({
  name: joi.string().required(),

  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com"] } })
    .required(),

  password: joi.string().required(),

  role: joi.string().valid("user", "admin").required(),
});

module.exports = userSchema