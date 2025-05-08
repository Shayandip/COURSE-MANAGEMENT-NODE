const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Examination',
    required: true,
  },
}, { timestamps: true });

QuestionSchema.virtual('options', {
  ref: 'Option',
  localField: '_id',
  foreignField: 'question',
});

QuestionSchema.set('toObject', { virtuals: true });
QuestionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Question', QuestionSchema);
