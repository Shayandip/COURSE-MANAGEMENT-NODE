const questionService = require("../services/question.service");

async function createQuestions(req, res, next) {
  try {
    const examId = req.params.examId;
    const questions = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        isSuccess: false,
        statusCode: 400,
        message: "Request body must be a non-empty array of questions!",
      });
    }
    const createdQuestions = await questionService.createMultipleQuestions(
      examId,
      questions
    );
    return res.status(201).json({
      isSuccess: true,
      statusCode: 201,
      message: "Questions created successfully",
      data: createdQuestions,
    });
  } catch (error) {
    next(error);
  }
}

async function getQuestionsByExam(req, res, next) {
  try {
    const { limit, offset, keyword, examId } = req.query;
    if (!examId) {
      return res.status(400).json({
        isSuccess: false,
        statusCode: 400,
        message: "examId required!",
      });
    }
    const result = await questionService.getQuestionsByExam({
      limit,
      offset,
      keyword,
      examId,
    });
    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Questions with options fetched successfully",
      question: result.questions,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}

async function userGetQuestionsByExam(req, res, next) {
  try {
    const { limit, offset, examId } = req.query;
    if (!examId) {
      return res.status(400).json({
        isSuccess: false,
        statusCode: 400,
        message: "examId required!",
      });
    }
    const result = await questionService.userGetQuestionsByExam({
      limit,
      offset,
      examId,
    });
    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Questions with options fetched successfully",
      question: result.questions,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}

async function updateQuestionById(req, res, next) {
  try {
    const id = req.params.id;
    const { question, marks, options } = req.body;
    const { question: updatedQuestion, options: updatedOptions } =
      await questionService.updateQuestionById(id, {
        question,
        marks,
        options,
      });
    return res.status(200).json({
      isSuccess: true,
      statusCode: 200,
      message: "Updation successful",
      data: {
        question: updatedQuestion,
        ...(updatedOptions && { options: updatedOptions }),
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createQuestions,
  updateQuestionById,
  getQuestionsByExam,
  userGetQuestionsByExam,
};
