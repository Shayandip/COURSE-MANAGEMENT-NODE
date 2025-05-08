const Joi = require("joi");
const allEnums = require("../helper/enum");

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  role: Joi.valid(allEnums.UserRole.ADMIN, allEnums.UserRole.USER).required(),
});

const register = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  // role: Joi.valid(allEnums.UserRole.ADMIN, allEnums.UserRole.USER).required(),
  name: Joi.string().min(1).required(),
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),
  gender: Joi.valid(allEnums.Gender.MALE, allEnums.Gender.FEMALE).required(),
});

module.exports = {
  login,
  register,
};
