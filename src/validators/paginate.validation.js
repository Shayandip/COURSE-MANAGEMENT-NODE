const Joi = require("joi");

const basicPagination = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0),
  keyword: Joi.string().allow("").optional(),
});

module.exports = {
  basicPagination,
};
