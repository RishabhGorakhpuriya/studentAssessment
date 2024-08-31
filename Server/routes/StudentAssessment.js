const express = require('express');
const {AssessmentWithStudent, getStudentAssessment, updateStudentResult} = require('../controller/StudentAssessment')
const { authenticate, authorize } = require('../middlware/authenticate');
const router = express.Router();

// Create an assessment (Teacher only)
router.post('/studentAssessment/:id', AssessmentWithStudent);

router.get('/getAssessment/:id', authenticate, authorize(['student', 'teacher']), getStudentAssessment);


router.put('/updateResult/:id',authenticate, authorize(['student', 'teacher']), updateStudentResult);

module.exports = router;
