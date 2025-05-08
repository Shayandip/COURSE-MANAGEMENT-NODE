const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const allEnums = require("../helper/enum");
const User = require("../models/user.model");

async function createUser(data) {
  const { email, password, name, gender, phone } = data;
  const checkUser = await User.findOne({ email: email });
  if (checkUser) {
    throw createError(400, "Email already in use");
  }
  const checkDupliName = await User.findOne({ name: name });
  if (checkDupliName) {
    throw createError(400, "Name should be unique!");
  }
  const checkDupliPhone = await User.findOne({ phone: phone });
  if (checkDupliPhone) {
    throw createError(400, "Phone Number should be unique!");
  }
  const hashedPassword = await bcrypt.hash(String(password), 10);
  const newUser = new User({
    email: email,
    password: hashedPassword,
    role: allEnums.UserRole.USER,
    name: name,
    gender: gender,
    phone: phone,
  });
  const user = await newUser.save();
  return user;
}

async function getUsers({ offset = 0, limit = 10, keyword = "" }) {
  const query = {
    role: allEnums.UserRole.USER,
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
      { phone: { $regex: keyword, $options: "i" } },
    ],
  };

  const [users, total] = await Promise.all([
    User.find(query)
      .where({ role: allEnums.UserRole.USER })
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1 })
      .lean(),
    User.countDocuments(query),
  ]);

  return {
    users,
    total,
  };
}

module.exports = {
  createUser,
  getUsers,
};
