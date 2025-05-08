const Joi = require("joi");
// const mongoose = require("mongoose");

const createCourse = Joi.object({
  name: Joi.string().min(3).trim().required(),
  description: Joi.string().min(4).trim().required(),
  // createdBy: Joi.string()
  //   .required()
  //   .custom((value, helpers) => {
  //     if (!mongoose.Types.ObjectId.isValid(value)) {
  //       return helpers.error("any.invalid");
  //     }
  //     return value;
  //   }, "ObjectId validation"),
});

const updateCourse = Joi.object({
  name: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
});

const objectIdPattern = /^[0-9a-fA-F]{24}$/;
const courseAssign = Joi.object({
  courseId: Joi.string().pattern(objectIdPattern).required().messages({
    "string.pattern.base": `"courseId" must be a valid ObjectId`,
    "any.required": `"courseId" is required`,
  }),
  memberId: Joi.string().pattern(objectIdPattern).required().messages({
    "string.pattern.base": `"memberId" must be a valid ObjectId`,
    "any.required": `"memberId" is required`,
  }),
});

module.exports = { createCourse, updateCourse, courseAssign };
