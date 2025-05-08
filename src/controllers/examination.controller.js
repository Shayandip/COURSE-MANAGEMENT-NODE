const examinationService = require("../services/examination.service");

async function createExamination(req, res, next) {
  try {
    const { courseId, name, totalMarks, passMarks, durationInMinutes } =
      req.body;
    const examination = await examinationService.createExamination({
      courseId,
      name,
      totalMarks,
      passMarks,
      durationInMinutes,
      createdBy: req.user.id,
    });
    return res.status(201).json({
      isSuccess: true,
      statusCode: 201,
      message: "Examination created successfully",
      data: examination,
    });
  } catch (error) {
    next(error);
  }
}

async function getExamByCourseId(req, res, next) {
  try {
    const { offset, limit, keyword, courseId } = req.query;
    if (!courseId) {
      return res.status(400).json({
        isSuccess: false,
        statusCode: 400,
        message: "courseId is required",
      });
    }
    const result = await examinationService.getExamByCourseId(req.user.id, {
      offset: Number(offset) || 0,
      limit: Number(limit) || 10,
      keyword: keyword || "",
      courseId,
    });
    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Examinations fetched successfully",
      data: result.exam,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}

async function userGetExamByCourseId(req, res, next) {
  try {
    const { offset, limit, keyword, courseId } = req.query;
    if (!courseId) {
      return res.status(400).json({
        isSuccess: false,
        statusCode: 400,
        message: "courseId is required",
      });
    }
    const result = await examinationService.userGetExamByCourseId({
      offset: Number(offset) || 0,
      limit: Number(limit) || 10,
      keyword: keyword || "",
      courseId,
    });
    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Examinations fetched successfully",
      data: result.exam,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}

async function updateExamination(req, res, next) {
  try {
    const _id = req.params.id;
    const { name, totalMarks, passMarks, durationInMinutes } = req.body;
    const exam = await examinationService.updateExamination(_id, {
      name,
      totalMarks,
      passMarks,
      durationInMinutes,
      createdBy: req.user.id,
    });
    return res.status(201).json({
      isSuccess: true,
      statusCode: 200,
      message: "Examination updated successfully",
      data: exam,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createExamination,
  updateExamination,
  getExamByCourseId,
  userGetExamByCourseId,
};
