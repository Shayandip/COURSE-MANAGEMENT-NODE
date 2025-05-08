const authService = require("../services/auth.service");
const message = require("../helper/message");

async function login(req, res, next) {
  try {
    const { email, password, role } = req.body;
    const { token, user } = await authService.login({ email, password, role });
    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: message.LOGIN_SUCCESS,
      data: user,
      token,
    });
  } catch (error) {
    next(error);
  }
}

async function register(req, res, next) {
  try {
    const { email, password, name, gender, phone } = req.body;
    const { token, userWithoutPassword } = await authService.register({
      email,
      password,
      name,
      gender,
      phone,
    });    
    return res.status(201).json({
      isSuccess: true,
      statusCode: 201,
      message: "Admin registered successfully",
      data: userWithoutPassword,
      token,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { login, register };
