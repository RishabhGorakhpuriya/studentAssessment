import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import { MdDelete } from "react-icons/md";

const AssessmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]); // Ensure initial state is an array
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 4;

  useEffect(() => {
    const fetchAssessmentData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const questionsResponse = await axios.get(`http://localhost:4000/api/assessmentQuestion/getQuestionByAssessmentId/${id}`, config);
        setQuestions(questionsResponse.data);

      } catch (error) {
        console.error('Error fetching assessment or questions:', error);
        setError('Failed to fetch assessment details or questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [id]);

  const handleImportQuestions = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/questions', { assessmentId: id });
      setQuestions(prevQuestions => [...prevQuestions, ...response.data]);
    } catch (error) {
      console.error('Error importing questions:', error);
      setError('Failed to import questions.');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`http://localhost:4000/api/assessmentQuestion/deleteAssessmentQuestion/${questionId}`, config);
      console.log("Delete Successful");

      // Update the state to remove the deleted question
      setQuestions(prevQuestions => prevQuestions.filter(question => question.id !== questionId));
    } catch (error) {
      console.error('Error in deletion', error);
      setError('Failed to delete the question.');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  // Calculate pagination values
  const totalPages = Array.isArray(questions) ? Math.ceil(questions.length / questionsPerPage) : 0;
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = Array.isArray(questions) ? questions.slice(indexOfFirstQuestion, indexOfLastQuestion) : [];

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-row h-screen">
      <aside className="w-50">
        <SideBar />
      </aside>
      <div className="w-full p-4 bg-white rounded-lg shadow-lg flex flex-col m-5">
        <div className="flex justify-end gap-4 mb-4">
          <button
            onClick={() => navigate(`/addNewQuestion/${id}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Question
          </button>
          <button
            onClick={handleImportQuestions}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Import Questions From Question Bank
          </button>
        </div>
        {currentQuestions.length > 0 ? (
          <div>
            <ul className="list-disc pl-5">
              {Array.isArray(currentQuestions) && currentQuestions.map((question) => (
                <li key={question.id} className="m-8 flex items-start">
                  <MdDelete
                    size={20}
                    onClick={(event) => {
                      event.preventDefault();
                      handleDeleteQuestion(question.id);
                    }}
                    className="cursor-pointer text-red-500 mr-4"
                  />
                  <div>
                    <p className="text-2xl">{question.question}</p>
                    <ul className="text-2xl list-disc pl-5">
                      {question.options.map((option, index) => (
                        <li key={index}>{option}</li>
                      ))}
                    </ul>
                    <p className="text-2xl text-yellow-700">Answer: {question.answer}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Previous
              </button>
              <span className="text-xl">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-yellow-100 rounded-lg">
            <p className="text-yellow-600">No questions found for this assessment. Please add questions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentDetails;
