// controller/Questions.js
// const Assessment = require('../models/Assessments');
const Question = require('../models/Questions');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (err) {
        // Ensure only one response is sent
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    }
};


exports.addQuestion = async (req, res) => {
    try {
        // Extract and validate fields from request body
        const { question, options, answer, questionType} = req.body;
        if (!question || !options || !answer || !questionType) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Extract token from headers
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token and extract user ID
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            userId = decoded.id;
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Create a new question
        const newQuestion = new Question({
            question,
            options,
            answer,
            questionType,
            createdBy: userId // Use the user ID from the token
            // assessment
        });

        // Save the question to the database
        const savedQuestion = await newQuestion.save();

        // Respond with the saved question
        res.status(201).json(savedQuestion);
    } catch (err) {
        console.error('Error adding question:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.uppdateQuestion = async(req, res)=>{
    try{
        if (!question || !options || !answer || !questionType ) {
            return res.status(400).json({ message: 'All fields are required' });
        } 

        // Extract token from headers
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const id = req.params.id;
        const {question, options, answer, questionType, createdBy } = req.body;
        if (!question && !options && !answer && !questionType && !createdBy) {
            return res.status(400).json({ message: 'At least one field is required to update' });
        }
         // Find and update the question
         const updatedQuestion = await Question.findByIdAndUpdate(id, {
            $set: { question, options, answer, questionType, createdBy }
        }, { new: true });

        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Respond with the updated question
        res.status(200).json(updatedQuestion);

    }catch(err){
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

exports.deleteQuestion = async (req, res) => {
    try {
        const id = req.params.id; // Retrieve the question ID from the request parameters
        
        // Delete the question from the database
        const deletedQuestion = await Question.findByIdAndDelete(id);

        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Respond with a success message
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};