const joi = require("joi");

const reservationSchema = joi.object({
  userId: joi.string().required(),

  spaceId: joi.string().required(),

  startTime: joi.date().iso().required(),

  endTime: joi.date().iso().required(),
});

module.exports = reservationSchema;
