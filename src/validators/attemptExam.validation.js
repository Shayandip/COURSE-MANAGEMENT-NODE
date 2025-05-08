const Joi = require("joi");
const mongoose = require("mongoose");

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId Validation");

const addAttemptSchema = Joi.object({
  examId: objectId.required(),
  //   member: objectId.required(),
  answers: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().required(),
        selectedOption: Joi.string().required(),
        isCorrect: Joi.boolean().required(),
        marksObtained: Joi.number().min(0).required(),
      })
    )
    .min(1)
    .required(),
});

const attemptPagination = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0),
  keyword: Joi.string().allow("").optional(),
  userId: objectId.required(),
});

module.exports = {
  addAttemptSchema,
  attemptPagination,
};
