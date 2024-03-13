const { validationResult, body } = require("express-validator");
const Questions = require("../db/models/Questions");

const addQuestions = async (req, res) => {
  const isReadmeNeeded = req.headers.condition

  const validationRules = [
    body("questionCategory")
      .notEmpty()
      .withMessage("questionCategory cannot be empty")
      .isString()
      .withMessage("questionCategory must be a string"),
    body("questionName")
      .notEmpty()
      .withMessage("questionName cannot be empty")
      .isString()
      .withMessage("questionName must be a string"),
    body("hardnessScore")
      .notEmpty()
      .withMessage("hardnessScore cannot be empty")
      .isString()
      .withMessage("hardnessScore must be a string"),
    body("tableNames")
      .notEmpty()
      .withMessage("Table names cannot be empty")
      .isArray()
      .withMessage("Table names must be an array"),
    body("tags")
      .notEmpty()
      .withMessage("Tags cannot be empty")
      .isArray()
      .withMessage("Tags must be an array"),
    body("status")
      .notEmpty()
      .withMessage("Status cannot be empty")
      .isString()
      .withMessage("Status must be a string"),
    body("dataCMD")
      .notEmpty()
      .withMessage("DataCMD cannot be empty")
      .isString()
      .withMessage("DataCMD must be a string"),
    body("dataTableCMD")
      .notEmpty()
      .withMessage("DataTableCMD cannot be empty")
      .isArray()
      .withMessage("DataTableCMD must be an array"),
    body("description")
      .notEmpty()
      .withMessage("Description cannot be empty")
      .isString()
      .withMessage("Description must be a string"),
    body("answers")
      .notEmpty()
      .withMessage("Answers cannot be empty")
      .isArray()
      .withMessage("Answers must be an array"),
    body("readme")
      .custom((value) => {
        if (isReadmeNeeded && !value) {
          throw new Error("Readme is required");
        } else if (!isReadmeNeeded && value) {
          throw new Error("Readme is not needed");
        }
        return true;
      })
      .notEmpty()
      .withMessage("Readme cannot be empty")
      .isString()
      .withMessage("Readme must be a string"),
    body("answers.*.question")
      .notEmpty()
      .withMessage("Question cannot be empty")
      .isString()
      .withMessage("Question must be a string"),
    body("answers.*.answer")
      .notEmpty()
      .withMessage("Answer cannot be empty")
      .isString()
      .withMessage("Answer must be a string"),
    body("answers.*.output")
      .notEmpty()
      .withMessage("Output cannot be empty")
      .isArray()
      .withMessage("Output must be an array"),
    body("answers.*.output.*.result")
      .notEmpty()
      .withMessage("Result cannot be empty")
      .isArray()
      .withMessage("Result must be an array"),
    body("answers.*.output.*.result.*.columns")
      .notEmpty()
      .withMessage("Columns cannot be empty")
      .isArray()
      .withMessage("Columns must be an array"),
    body("answers.*.output.*.result.*.values")
      .notEmpty()
      .withMessage("Values cannot be empty")
      .isArray()
      .withMessage("Values must be an array"),
  ];

  await Promise.all(validationRules.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newQuestion = new Questions(req.body);

  try {
    const savedQuestion = await newQuestion.save();
    console.log("Saved question:", savedQuestion);
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error("Error saving question:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const getQuestions = async (req, res) => {
  try {
    const questions = await Questions.find();
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error retrieving questions:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

const getQuestionById = async (req, res) => {
  const { questionId } = req.params;
  try {
    const question = await Questions.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error("Error retrieving question by ID:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  addQuestions,
  getQuestions,
  getQuestionById,
};
