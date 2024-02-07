const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultSchema = new Schema({
  columns: {
    type: [String],
    required: true,
  },
  values: {
    type: [[Schema.Types.Mixed]],
    required: true,
  },
});

const outputSchema = new Schema({
  result: [resultSchema],
});

const answerSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  output: [outputSchema],
});

const questionSchema = new Schema({
  tableNames: {
    type: [String],
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  dataCMD: {
    type: String,
    required: true,
  },
  dataTableCMD: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  answers: [answerSchema],
  readme: {
    type: String,
    required: true,
  },
});

const Questions = mongoose.model('Questions', questionSchema);

module.exports = Questions;
