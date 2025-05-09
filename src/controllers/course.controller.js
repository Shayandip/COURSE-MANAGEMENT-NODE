const courseService = require("../services/course.service");

async function createCourse(req, res, next) {
  try {
    const { name, description } = req.body;
    const course = await courseService.createCourse({
      name,
      description,
      createdBy: req.user.id,
    });
    return res.status(201).json({
      isSuccess: true,
      statusCode: 201,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
}

async function getCourse(req, res, next) {
  try {
    const { offset, limit, keyword } = req.query;
    const result = await courseService.getCourse(req.user.id, {
      offset: Number(offset) || 0,
      limit: Number(limit) || 10,
      keyword: keyword || "",
    });
    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Course fetched successfully",
      data: result.course,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}

async function updateCourse(req, res, next) {
  try {
    const _id = req.params.id;
    if (!_id) {
      return res.status(400).json({
      isSuccess: true,
      statusCode: 400,
      message: "Course Id is required!",
    });
    }
    const { name, description } = req.body;
    const course = await courseService.updateCourse(_id, {
      name,
      description,
      createdBy: req.user.id,
    });
    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { createCourse, updateCourse, getCourse };
