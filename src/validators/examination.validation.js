const Joi = require("joi");

const createExamination = Joi.object({
  courseId: Joi.string().required(),
  name: Joi.string().min(3).trim().required(),
  totalMarks: Joi.number().integer().min(1).required(),
  passMarks: Joi.number().integer().min(0).required(),
  durationInMinutes: Joi.number().integer().min(1).required(),
});

const updateExamination = Joi.object({
  name: Joi.string().trim().optional(),
  totalMarks: Joi.number().integer().min(1).optional(),
  passMarks: Joi.number().integer().min(0).optional(),
  durationInMinutes: Joi.number().integer().min(1).optional(),
}).custom((value, helpers) => {
  if (
    value.passMarks !== undefined &&
    value.totalMarks !== undefined &&
    value.passMarks > value.totalMarks
  ) {
    return helpers.message('"passMarks" cannot be greater than "totalMarks"');
  }
  return value;
}, "passMarks vs totalMarks validation");

const examPagination = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0),
  keyword: Joi.string().allow("").optional(),
  courseId: Joi.string().required().messages({
    "any.required": "courseId is required",
    "string.empty": "courseId cannot be empty",
  }),
});

module.exports = { createExamination, updateExamination, examPagination };
