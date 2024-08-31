import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SideBar from './SideBar';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
const AddQuestionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']); // 4 options
  const [answer, setAnswer] = useState('');
  const [questionType, setQuestionType] = useState('MCQ');
  const [topic, setTopic] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      console.log(token);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const assessmentQuestionData = {
        question,
        options,
        answer,
        questionType,
        isActive,
        createdBy: 'user_id_here', // Replace with actual user ID
        assessment: id
      };

      // Data for the question table
      const questionData = {
        question,
        options,
        answer,
        questionType,
        isActive,
        // createdBy: 'user_id_here' // Replace with actual user ID
      };

      console.log(questionData, id)
      // http://localhost:4000/api/addquestions

      const response = await axios.post(`http://localhost:4000/api/assessmentQuestion/addQuestionInAssessment`, assessmentQuestionData, config);
      console.log('Question added:', response);

      await axios.post(`http://localhost:4000/api/addquestions`, questionData, config);
      console.log('Question added to question table');
      alert("Question Added Successfully");
      if (response.statusText == "Created") {
        navigate(`/assessment/${id}`);// Navigate to home page upon successful signup
      }
      // Clear form or redirect
    } catch (error) {
      console.error('Error adding question:', error);
      setError('Failed to add question');
    }
  };

  return (
    <div className="flex flex-row h-screen">
      <aside className="w-50">
        <SideBar />
      </aside>
      <div className="w-full m-5 p-20 bg-white rounded-lg shadow-lg ">
        <h2 className="text-3xl font-semibold mb-4">Add New Question</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="question" className="block text-gray-800 mb-2">Question</label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Options</label>
            {options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="w-full p-3 mb-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Option ${index + 1}`}
                required
              />
            ))}
          </div>
          <div className="mb-4">
            <label htmlFor="answer" className="block text-gray-700 mb-2">Answer</label>
            <input
              id="answer"
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Correct Answer"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="questionType" className="block text-gray-700 mb-2">Question Type</label>
            <select
              id="questionType"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MCQ">MCQ</option>
              <option value="True/False">True/False</option>
              <option value="Short Answer">Short Answer</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="topic" className="block text-gray-700 mb-2">Topic</label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Topic"
              required
            />
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="form-checkbox text-blue-500"
              />
              <span className="ml-2 text-gray-700">Active</span>
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Question
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionForm;
