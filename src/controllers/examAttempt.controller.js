const examAttemptService = require("../services/examAttempt.service");

async function addAttemptRecord(req, res, next) {
  try {
    const { examId, answers } = req.body;
    const examAttempt = await examAttemptService.addAttemptRecord({
      examId,
      member: req.user.id,
      answers,
    });
    res.status(201).json({
      isSuccess: true,
      statusCode: 201,
      message: "Exam result submitted successfully",
      data: examAttempt,
    });
  } catch (error) {
    next(error);
  }
}

async function getResult(req, res, next) {
  try {
    const _id = req.params.id;
    if (!_id) {
      return res.status(400).json({
        isSuccess: false,
        statusCode: 400,
        message: "exampAttempt Id required!",
      });
    }
    const result = await examAttemptService.getResult(_id);
    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Result fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function getResultListByAdmin(req, res, next) {
  try {
    const { offset, limit, userId } = req.query;
    if (!userId) {
      return res.status(400).json({
        isSuccess: false,
        statusCode: 400,
        message: "user's Id required!",
      });
    }
    const result = await examAttemptService.getResultListByAdmin({
      offset: Number(offset) || 0,
      limit: Number(limit) || 10,
      userId,
    });
    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Results fetched successfully",
      data: result.result,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}

async function getResultListByUser(req, res, next) {
  try {
    const { offset, limit } = req.query;
    const result = await examAttemptService.getResultListByUser({
      offset: Number(offset) || 0,
      limit: Number(limit) || 10,
      userId: req.user.id,
    });
    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Results fetched successfully",
      data: result.result,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}

async function removeResult(req, res, next) {
  try {
    const _id = req.params.id;
    if (!_id) {
      return res.status(400).json({
        isSuccess: false,
        statusCode: 400,
        message: "exampAttempt Id required!",
      });
    }
    const response = await examAttemptService.removeResult(_id);
    res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Result deleted successfully",
      data: { id: response },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addAttemptRecord,
  getResult,
  getResultListByAdmin,
  removeResult,
  getResultListByUser
};
