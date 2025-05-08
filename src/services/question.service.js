const createError = require("http-errors");
const Question = require("../models/question.model");
const Option = require("../models/opiton.model");

async function createMultipleQuestions(examId, questions) {
  const createdQuestions = [];

  for (const q of questions) {
    const { question, marks, options } = q;
    const existing = await Question.findOne({ exam: examId, question });
    if (existing) {
      throw createError(
        400,
        `Question "${question}" already exists under this exam`
      );
    }
    const correctOptions = options.filter((opt) => opt.isCorrect);
    if (correctOptions.length !== 1) {
      throw createError(
        400,
        `Exactly one correct option is required for question: ${question}`
      );
    }
    const newQuestion = await Question.create({
      exam: examId,
      question,
      marks,
    });
    if (!Array.isArray(options) || options.length === 0) {
      throw createError(400, `Options required for question: ${question}`);
    }
    const optionDocs = options.map((opt) => ({
      text: opt.text,
      isCorrect: opt.isCorrect || false,
      question: newQuestion._id,
    }));
    await Option.insertMany(optionDocs);

    createdQuestions.push(newQuestion);
  }

  return createdQuestions;
}

async function getQuestionsByExam({ limit, offset, keyword, examId }) {
  const filter = {
    exam: examId,
  };
  if (keyword) {
    filter.question = { $regex: keyword, $options: "i" };
  }
  const total = await Question.countDocuments(filter);
  const questions = await Question.find(filter)
    .skip(offset)
    .limit(limit)
    .populate("options")
    .sort({ createdAt: -1 })
    .lean();

  if (questions.length == 0) {
    throw createError(404, "Questions not found with this exam Id");
  }

  return {
    questions,
    total,
  };
}

async function userGetQuestionsByExam({ limit, offset, examId }) {
  const filter = {
    exam: examId,
  };
  const total = await Question.countDocuments(filter);
  const questions = await Question.find(filter)
    .skip(offset)
    .limit(limit)
    .populate({
      path: "options",
    })
    .sort({ createdAt: -1 })
    .lean();

  if (questions.length == 0) {
    throw createError(404, "Questions not found with this exam Id");
  }

  return {
    questions,
    total,
  };
}

async function updateQuestionById(id, data) {
  const { question, marks, options } = data;
  const checkQuestion = await Question.findById(id);
  if (!checkQuestion) {
    throw createError(404, "Question not found");
  }
  const duplicate = await Question.findOne({
    _id: { $ne: id },
    exam: checkQuestion.exam,
    question: question,
  });
  if (duplicate) {
    throw createError(
      400,
      "Another question with this text already exists under the same exam"
    );
  }
  checkQuestion.question = question || checkQuestion.question;
  checkQuestion.marks = marks || checkQuestion.marks;
  await checkQuestion.save();

  let updatedOptions = [];

  if (options && Array.isArray(options)) {
    const correctOptions = options.filter((opt) => opt.isCorrect);
    if (correctOptions.length !== 1) {
      throw createError(400, "Exactly one correct option is required");
    }
    await Option.deleteMany({ question: id });
    const newOptions = options.map((opt) => ({
      text: opt.text,
      isCorrect: opt.isCorrect || false,
      question: id,
    }));
    updatedOptions = await Option.insertMany(newOptions);
  }

  return {
    question: checkQuestion,
    options: updatedOptions.length > 0 ? updatedOptions : undefined,
  };
}

module.exports = {
  createMultipleQuestions,
  updateQuestionById,
  getQuestionsByExam,
  userGetQuestionsByExam,
};
