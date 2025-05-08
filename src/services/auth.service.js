const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const message = require("../helper/message");
const createError = require("http-errors");
const allEnums = require("../helper/enum");
const User = require("../models/user.model");

async function login(credentials) {
  const { email, password, role } = credentials;
  const user = await User.findOne({ email, role });
  if (!user) {
    throw createError(400, message.USER_NOT_FOUND);
  }
  const isPasswordValid = await bcrypt.compare(String(password), user.password);
  if (!isPasswordValid) {
    throw createError(401, message.INVALID_CREDENTIAL);
  }
  const payload = { id: user._id, email: user.email, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return { token, user: { _id: user._id, email: user.email, role: user.role } };
}

async function register(userData) {
  const checkAdmin = await User.findOne({ email: userData.email });
  if (checkAdmin) {
    throw createError(400, "Email already in use");
  }
  const checkDupliName = await User.findOne({ name: userData.name });
  if (checkDupliName) {
    throw createError(400, "Name should be unique!");
  }
  const checkDupliPhone = await User.findOne({ phone: userData.phone });
  if (checkDupliPhone) {
    throw createError(400, "Phone Number should be unique!");
  }
  const hashedPassword = await bcrypt.hash(String(userData.password), 10);
  const newUser = new User({
    email: userData.email,
    password: hashedPassword,
    role: allEnums.UserRole.ADMIN,
    name: userData.name,
    gender: userData.gender,
    phone: userData.phone,
  });
  const user = await newUser.save();
  const { id, password, ...userWithoutPassword } = user.toObject();

  const payload = { id: user._id, email: user.email, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return { token, userWithoutPassword };
}

module.exports = { login, register };
