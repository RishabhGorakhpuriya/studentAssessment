import React, { useState, useEffect } from 'react';
import SideBar from '../SideBar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const AssessmentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  // const studentId = localStorage.getItem('id')
  console.log(id);
  useEffect(() => {
    const fetchAssessmentHistory = async () => {
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

        // Replace with your API endpoint
        const response = await axios.get(`http://localhost:4000/api/getAssessment/${id}`, config);
        setHistory(response.data); // Assuming the response data is an array of assessments
        console.log(response.data);
      } catch (err) {
        setError('Failed to load history');
        console.error('Error fetching assessment history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentHistory();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  const fullName = localStorage.getItem('fullName')
  const emailId = localStorage.getItem('emailId');
  return (
    <div className="flex flex-row h-screen">
      <aside className="w-50">
        <SideBar />
      </aside>
      <div className="w-full m-5 p-20 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Assessment History</h1>
        <div className="space-y-4">
          {history.length === 0 ? (
            <p>No history found.</p>
          ) : (
            Array.isArray(history) && history.map(histories => (
              <div key={histories.studentId} className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2">Student Name: {fullName}</h2>
                <h2 className="text-xl font-semibold mb-2">Email : {emailId}</h2>
                <p className='my-2'>{new Date(histories.createdAt).toLocaleDateString()}</p>
                <li key={histories.id} className="mt-5">
                  <span className="font-medium text-xl">Assessment Title:  {histories.assessmentId.title}</span>
                  <span className="ml-4 font-medium text-xl">Score: {histories.score || 'N/A'}</span>
                  <span className="ml-4 font-medium text-xl">Feedback: {histories.feedback || 'No feedback'}</span>
                </li>

              </div>

            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentHistory;
