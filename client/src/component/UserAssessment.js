import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


const Assessment = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [startassessment, setStartAssessment] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    const startAssessmentApi = async () => {
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

        const response = await axios.get(`http://localhost:4000/api/assessmentQuestion/getQuestionByAssessmentId/${id}`, config);
        setStartAssessment(response.data);
        console.log(response.data);

      } catch (error) {
        console.error('Error fetching assessment or questions:', error);
      }
    };
    startAssessmentApi();
  }, [])

  const handleChange = (e, index) => {
    setAnswers(prev => ({
      ...prev,
      [index]: e.target.value
    }));
  };
  const studentAssessmentIds = localStorage.getItem('studentAssessmentIds')
  const studentAssId = JSON.parse(studentAssessmentIds)[id];
  console.log(studentAssId);
  const handleSubmit = async (e) => {
    e.preventDefault();

    let score = 0;
    startassessment.forEach((q, index) => {
      if (answers[index] === q.answer) {
        score += 1;
      }
    });

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

      // Assuming you want to send the score to the server
      const response = await axios.put(`http://localhost:4000/api/updateResult/${studentAssId}`,{ score }, config);
      console.log(response.data);

      // Navigate after successful submission
      navigate('/SubmitSuccessfull', { state: { score, total: startassessment.length } });

    } catch (error) {
      console.error('Error updating result:', error);
    }
  };

  const totalPages = startassessment.length;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentQuestionIndex = currentPage - 1;
  const currentQuestion = startassessment[currentQuestionIndex];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar with all questions */}
      <div className="w-1/6 bg-gray-200 p-20 border-r border-gray-300 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Questions</h2>
        <div className="grid grid-cols-4 gap-2">
          {Array.isArray(startassessment) && startassessment.map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`w-12 h-12 flex items-center justify-center rounded-full text-white ${answers[index] ? 'bg-green-500' : (currentQuestionIndex === index ? 'bg-purple-500' : 'bg-gray-300')}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="w-3/4 p-8 mx-10">
        <h1 className="text-3xl font-bold mb-6">Assessment</h1>
        <form onSubmit={handleSubmit}>
          {currentQuestion && (
            <div className="mt-20">
              <p className="text-4xl font-semibold mb-2">{currentPage}. {currentQuestion.question}</p>
              {Array.isArray(currentQuestion.options) && currentQuestion.options.map((option, i) => (
                <label key={i} className="block m-7 text-2xl">
                  <input
                    type="radio"
                    name={`question${currentPage}`}
                    value={option}
                    checked={answers[currentQuestionIndex] === option}
                    onChange={(e) => handleChange(e, currentQuestionIndex)}
                    className="mr-2 "
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center mt-10">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                className="px-4 py-2 border rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Previous
              </button>
              <span className="px-4 py-2 border rounded">{currentPage} / {totalPages}</span>
              <button
                type="button"
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                className="px-4 py-2 border rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Next
              </button>
            </div>
            {currentPage === totalPages && (
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Submit Answers
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Assessment;
