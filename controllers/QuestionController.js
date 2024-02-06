const { validationResult, body } = require('express-validator');
const Questions = require('../db/models/Questions');

const addQuestions = async (req, res) => {
  const validationRules = [
    body('tableNames').isArray().withMessage('Table names must be an array'),
    body('tags').isArray().withMessage('Tags must be an array'),
    body('status').isArray().withMessage('Status must be an array'),
    body('dataCMD').isString().withMessage('DataCMD must be a string'),
    body('dataTableCMD').isArray().withMessage('DataTableCMD must be an array'),
    body('description').isString().withMessage('Description must be a string'),
    body('answers').isArray().withMessage('Answers must be an array'),
    body('readme').isString().withMessage('Readme must be a string'),

    body('answers.*.question').isString().withMessage('Question must be a string'),
    body('answers.*.answer').isString().withMessage('Answer must be a string'),
    body('answers.*.output').isArray().withMessage('Output must be an array'),
    body('answers.*.output.*.result').isArray().withMessage('Result must be an array'),
    body('answers.*.output.*.result.*.columns').isArray().withMessage('Columns must be an array'),
    body('answers.*.output.*.result.*.values').isArray().withMessage('Values must be an array'),
  ];

  await Promise.all(validationRules.map(validation => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newQuestion = new Questions(req.body);

  try {
    const savedQuestion = await newQuestion.save();
    console.log('Saved question:', savedQuestion);
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error('Error saving question:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

const getQuestions = async (req, res) => {
  try {
    const questions = await Questions.find();
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error retrieving questions:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

const getQuestionById = async (req, res) => {
  const { questionId } = req.params;

  try {
    const question = await Questions.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error('Error retrieving question by ID:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  addQuestions,
  getQuestions,
  getQuestionById
};
