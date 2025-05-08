const mongoose = require("mongoose");
const allEnums = require("../helper/enum");

const AnswerSchema = new mongoose.Schema(
  {
    question: String,
    selectedOption: String,
    isCorrect: Boolean,
    marksObtained: Number,
  },
  { _id: false }
);

const ExamAttemptSchema = new mongoose.Schema({
  examination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Examination",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answers: [AnswerSchema],
  totalObtained: {
    type: Number,
    required: true,
  },
  result: {
    type: String,
    enum: allEnums.Result,
    default: allEnums.Result.PASS,
    required: true,
  },
  attemptedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ExamAttempt", ExamAttemptSchema);
