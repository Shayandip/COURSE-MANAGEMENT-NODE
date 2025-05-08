const Joi = require("joi");

const createExamination = Joi.array()
  .items(
    Joi.object({
      question: Joi.string().required(),
      marks: Joi.number().integer().positive().required(),
      options: Joi.array()
        .items(
          Joi.object({
            text: Joi.string().required(),
            isCorrect: Joi.boolean().default(false),
          })
        )
        .min(1)
        .required(),
    })
  )
  .min(1)
  .required()
  .messages({
    "array.min": "Request body must be a non-empty array of questions!",
    "array.base": "Request body must be an array of questions!",
    "any.required": "Request body is required!",
  });

const updateQuestion = Joi.object({
  question: Joi.string().optional(),
  marks: Joi.number().integer().positive().optional(),
  options: Joi.array()
    .items(
      Joi.object({
        text: Joi.string().required(),
        isCorrect: Joi.boolean().default(false),
      })
    )
    .min(1)
    .optional()
    .messages({
      "array.min": "If provided, at least one option must be included",
    }),
});

const questionPagination = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0),
  keyword: Joi.string().allow("").optional(),
  examId: Joi.string().required().messages({
    "any.required": "examId is required",
    "string.empty": "examId cannot be empty",
  }),
});

module.exports = { createExamination, updateQuestion, questionPagination };
