const createError = require("http-errors");
const ExamAttempt = require("../models/examAttempt.model");
const Examination = require("../models/examination.model");
const User = require("../models/user.model");
const allEnums = require("../helper/enum");

async function addAttemptRecord(data) {
  const { examId, member, answers } = data;
  const checkExam = await Examination.findById(examId).populate("course");
  if (!checkExam) {
    throw createError(404, "Invalid examination ID");
  }
  const checkCourse = checkExam.course;
  if (!checkCourse) {
    throw createError(404, "Course not found in the examination");
  }
  const checkMember = await User.findById(member);
  if (!checkMember) {
    throw createError(404, "Invalid member ID");
  }
  let totalObtained = 0;
  const attemptedAnswers = answers.map((answer) => {
    const isCorrect = answer.isCorrect;
    const marks = isCorrect ? answer.marksObtained || 1 : 0;
    totalObtained += marks;
    return {
      question: answer.question,
      selectedOption: answer.selectedOption,
      isCorrect,
      marksObtained: marks,
    };
  });

  const result =
    totalObtained >= checkExam.passMarks
      ? allEnums.Result.PASS
      : allEnums.Result.FAIL;

  const examAttempt = await ExamAttempt.create({
    examination: examId,
    course: checkCourse._id,
    member,
    answers: attemptedAnswers,
    totalObtained,
    result,
    attemptedAt: new Date(),
  });

  return examAttempt;
}

async function getResult(_id) {
  const findResult = await ExamAttempt.findById(_id)
    .populate({
      path: "course",
      select: "name",
    })
    .populate({
      path: "examination",
      select: "name",
    })
    .populate({
      path: "member",
      select: "name",
    })
    .lean();
  if (!findResult) {
    throw createError(404, "Result Not found with this id");
  }
  return findResult;
}

async function getResultListByAdmin({ offset, limit, userId }) {
  const query = {
    member: userId,
  };
  const [result, total] = await Promise.all([
    ExamAttempt.find(query)
      .select("-answers")
      .populate({
        path: "course",
        select: "name",
      })
      .populate({
        path: "examination",
        select: "name",
      })
      .populate({
        path: "member",
        select: "name",
      })
      .lean()
      .limit(limit)
      .skip(offset)
      .sort({ attemptedAt: -1 }),
    ExamAttempt.countDocuments(query),
  ]);
  if (!result) {
    throw createError(404, "Results Not found with this id");
  }
  return { result, total };
}

async function getResultListByUser({ offset, limit, userId }) {
  const query = {
    member: userId,
  };
  const [result, total] = await Promise.all([
    ExamAttempt.find(query)
      .select("-answers")
      .populate({
        path: "course",
        select: "name",
      })
      .populate({
        path: "examination",
        select: "name",
      })
      .populate({
        path: "member",
        select: "name",
      })
      .lean()
      .limit(limit)
      .skip(offset)
      .sort({ attemptedAt: -1 }),
    ExamAttempt.countDocuments(query),
  ]);
  if (!result) {
    throw createError(404, "Results Not found with this id");
  }
  return { result, total };
}

async function removeResult(_id) {
  const result = await ExamAttempt.findByIdAndDelete(_id);
  if (!result) {
    throw createError(404, "Exam result not found with this ID");
  }
  return _id;
}

module.exports = {
  addAttemptRecord,
  getResult,
  getResultListByAdmin,
  removeResult,
  getResultListByUser
};
