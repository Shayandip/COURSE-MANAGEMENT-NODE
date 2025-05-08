const createError = require("http-errors");
const Examination = require("../models/examination.model");

async function createExamination(data) {
  const {
    courseId,
    name,
    totalMarks,
    passMarks,
    durationInMinutes,
    createdBy,
  } = data;
  const checkExam = await Examination.findOne({
    course: courseId,
    name: name,
    createdBy: createdBy,
  });
  if (checkExam) {
    throw createError(
      409,
      "This examination under this course is already exists!"
    );
  }
  const newExamination = Examination.create({
    course: courseId,
    name,
    totalMarks,
    passMarks,
    durationInMinutes,
    createdBy: createdBy,
  });
  return newExamination;
}

async function getExamByCourseId(
  createdBy,
  { offset, limit, keyword, courseId }
) {
  const query = {
    createdBy,
    course: courseId,
  };
  if (keyword) {
    query.name = { $regex: keyword, $options: "i" };
  }
  const [exam, total] = await Promise.all([
    Examination.find(query).limit(limit).skip(offset).sort({ createdAt: -1 }),
    Examination.countDocuments(query),
  ]);

  if (total === 0) {
    throw createError(404, "No Examinations found with this courseId");
  }

  return { exam, total };
}

async function userGetExamByCourseId({ offset, limit, keyword, courseId }) {
  const query = {
    course: courseId,
  };
  if (keyword) {
    query.name = { $regex: keyword, $options: "i" };
  }
  const [exam, total] = await Promise.all([
    Examination.find(query).limit(limit).skip(offset).sort({ createdAt: -1 }),
    Examination.countDocuments(query),
  ]);

  if (total === 0) {
    throw createError(404, "No Examinations found with this courseId");
  }

  return { exam, total };
}

async function updateExamination(_id, data) {
  const { name, totalMarks, passMarks, durationInMinutes, createdBy } = data;
  const examination = await Examination.findById(_id);
  if (!examination) {
    throw createError(404, "Exam not found");
  }
  if (examination.createdBy.toString() !== createdBy) {
    throw createError(
      403,
      "You are not authorized to update this examination!"
    );
  }
  const duplicate = await Examination.findOne({
    _id: { $ne: _id },
    name: name,
    createdBy: createdBy,
  });
  if (duplicate) {
    throw createError(409, "Another exam with this name already exists");
  }
  examination.name = name || examination.name;
  examination.totalMarks = totalMarks || examination.totalMarks;
  examination.passMarks = passMarks || examination.passMarks;
  examination.durationInMinutes =
    durationInMinutes || examination.durationInMinutes;
  examination.updatedAt = new Date();

  const updatedExam = await examination.save();
  return updatedExam;
}

module.exports = {
  createExamination,
  updateExamination,
  getExamByCourseId,
  userGetExamByCourseId,
};
