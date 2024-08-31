import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from './SideBar';
import { json, Link } from 'react-router-dom';
import { FaPenToSquare } from "react-icons/fa6";

// Component for displaying an individual assessment
const AssessmentCard = ({ assessment }) => (
  <Link
    to={`/assessment/${assessment.id}`}
    className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl mt-10"
  >
    <Link to={`/updateAssessment/${assessment.id}`}><FaPenToSquare size={20} /></Link>
    <h3 className="text-2xl font-semibold mb-4 text-center">{assessment.title}</h3>
    <p className="text-lg text-gray-700 mb-4 text-center">{assessment.description}</p>
    <p className="text-sm text-gray-500 mb-2 text-center">Due Date: {new Date(assessment.dueDate).toLocaleDateString()}</p>
  </Link>
);

// Component for displaying an individual assessment for students
const AssessmentCard2 = ({ assessment }) => (
  <Link
    to={`/userAssessment/${assessment.id}`}
    className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl mt-10"
  >
    {/* <Link to={`/updateAssessment/${assessment.id}`}><FaPenToSquare size={20} /></Link> */}
    <h3 className="text-2xl font-semibold mb-4 text-center">{assessment.title}</h3>
    <p className="text-lg text-gray-700 mb-4 text-center">{assessment.description}</p>
    <p className="text-sm text-gray-500 mb-2 text-center">Due Date: {new Date(assessment.dueDate).toLocaleDateString()}</p>
  </Link>
);

const Home = () => {
  const [assessments, setAssessments] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const UserRole = localStorage.getItem('role');
  const userId = localStorage.getItem('id');

  useEffect(() => {
    const fetchAssessments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        let response;
        if (UserRole === 'teacher') {
          response = await axios.get('http://localhost:4000/api/assessment/', config);
        } else {
          response = await axios.get(`http://localhost:4000/api/getAssessment/${userId}`, config);
          console.log(response.data)
          let assessments = [];
          let studentAssessmentIds = {};
          response.data.forEach(obj => {
            assessments.push(obj.assessmentId);
            studentAssessmentIds[obj.assessmentId] = obj.id;
          });
          localStorage.setItem("studentAssessmentIds", JSON.stringify(studentAssessmentIds))
          response.data = assessments;
        }

        // Ensure response data is an array before setting state
        const data = Array.isArray(response.data) ? response.data : [];
        setAssessments(data);
        setFilteredAssessments(data); // Initialize filteredAssessments
      } catch (error) {
        console.error('Error fetching assessments:', error);
        // setError('Failed to fetch assessments.');
        setAssessments([]); // Reset to empty array on error
        setFilteredAssessments([]); // Reset to empty array on error
        setLoading(false);
      }
    };
    fetchAssessments();
  }, [UserRole, userId]);

  useEffect(() => {
    // Filter assessments based on search term
    if (Array.isArray(assessments)) {
      setFilteredAssessments(
        assessments.filter((assessment) =>
          assessment.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, assessments]);

  // 

  return (
    <div className="flex flex-row h-screen">
      <aside className="w-50">
        <SideBar />
      </aside>

      <div className="flex-1 rounded-lg shadow-lg p-8 mx-4 my-4 bg-white">
        <div className="mb-6 flex items-center space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-500 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-4">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a7 7 0 014.743 12.743l4.577 4.576a1 1 0 001.414-1.414l-4.577-4.576A7 7 0 1111 4z"></path>
              </svg>
            </span>
          </div>
          <button
            onClick={() => setSearchTerm('')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          >
            Clear
          </button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {UserRole === 'teacher' ? (
            filteredAssessments.length > 0 ? (
              Array.isArray(filteredAssessments) && filteredAssessments.map((assessment) => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))
            ) : (
              <p className="text-6xl text-gray-500">No assessments available</p>
            )
          ) : (
            filteredAssessments.length > 0 ? (
              Array.isArray(filteredAssessments) && filteredAssessments.map((assessment) => (
                <AssessmentCard2 key={assessment.id} assessment={assessment} />
              ))
            ) : (
              <p className="text-6xl text-center text-gray-500">No assessments available</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
