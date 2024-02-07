const express = require('express');
const questionsController = require('../controllers/QuestionController');

const router = express.Router();

router.post('/addQuestions', questionsController.addQuestions);
router.get('/getQuestions', questionsController.getQuestions);
router.get('/getQuestions/:questionId',questionsController.getQuestionById);

module.exports = router;
