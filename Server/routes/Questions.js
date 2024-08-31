// routes/QuestionRoutes.js
const express = require('express');
const { getAllQuestions, addQuestion, uppdateQuestion, deleteQuestion } = require('../controller/Questions');
const router = express.Router();


// Route to get all questions
router.get('/questions', getAllQuestions);
router.post('/addquestions', addQuestion);
router.put('/:id', uppdateQuestion);
router.delete('/:id', deleteQuestion);
module.exports = router;
