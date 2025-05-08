const userService = require("../services/user.service");

async function createUser(req, res, next) {
  try {
    const { email, password, name, gender, phone } = req.body;
    const user = await userService.createUser({
      email,
      password,
      name,
      gender,
      phone,
    });
    return res.status(201).json({
      isSuccess: true,
      statusCode: 201,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

async function getUsers(req, res, next) {
  try {    
    const { offset, limit, keyword } = req.query;

    const result = await userService.getUsers({
      offset: Number(offset) || 0,
      limit: Number(limit) || 10,
      keyword: keyword || '',
    });

    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: 'Users fetched successfully',
      data: result.users,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  createUser,
  getUsers,
};
