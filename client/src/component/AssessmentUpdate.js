import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import SideBar from './SideBar'; // Assuming you have a SideBar component

const AssessmentUpdate = () => {
  const { id } = useParams(); // Get assessment ID from URL
  const navigate = useNavigate(); // Hook to navigate programmatically

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessmentData = async () => {
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

        const response = await axios.get(`http://localhost:4000/api/assessment/get/${id}`, config);
        const { title, description, dueDate, isActive } = response.data;
        setTitle(title);
        setDescription(description);
        setDueDate(dueDate);
        setIsActive(isActive);
      } catch (error) {
        console.error('Error fetching assessment data:', error);
        setError('Failed to fetch assessment data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      const response = await axios.put(`http://localhost:4000/api/assessment/updateAssessment/${id}`, {
        title,
        description,
        dueDate,
        isActive,
      }, config);

      setSuccess('Assessment updated successfully!');
      navigate('/assessments'); // Redirect to the assessments list or another appropriate route
    } catch (error) {
      console.error('Error updating assessment:', error);
      setError('Failed to update assessment.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="text-red-600 mb-4">{error}</div>;

  return (
    <div className="flex flex-row h-screen">
      <aside className="w-50">
        <SideBar />
      </aside>
      <div className="w-full m-5 p-20 bg-white rounded-lg shadow-lg ">
        <form onSubmit={handleSubmit} className="">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight text-gray-900 mb-8">Update Assessment</h2>
            <p className="text-lg leading-8 text-gray-600 mb-8">
              Please fill out the form to update the assessment details.
            </p>

            {/* Error and Success Messages */}
            {error && <div className="text-red-600 mb-4">{error}</div>}
            {success && <div className="text-green-600 mb-4">{success}</div>}

            <div className="space-y-8">
              <div>
                <label htmlFor="title" className="block text-xl font-semibold leading-8 text-gray-900 mb-4">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Assessment Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="block w-full mt-2 rounded-lg border-gray-300 focus:ring-indigo-600 focus:border-indigo-600 text-lg py-4 px-6"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-xl font-semibold leading-8 text-gray-900 mb-4">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  placeholder="Assessment Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="block w-full mt-2 rounded-lg border-gray-300 focus:ring-indigo-600 focus:border-indigo-600 text-lg py-4 px-6"
                />
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-xl font-semibold leading-8 text-gray-900 mb-4">
                  Due Date
                </label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="block w-full mt-2 rounded-lg border-gray-300 focus:ring-indigo-600 focus:border-indigo-600 text-lg py-4 px-6"
                />
              </div>

              <div className="flex items-center space-x-4 mt-6">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                  className="h-6 w-6 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
                />
                <label htmlFor="isActive" className="text-xl font-semibold text-gray-900">
                  Active
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-8 mt-12">
            <button
              type="button"
              className="text-lg font-semibold leading-6 text-gray-900"
              onClick={() => navigate('/assessments')} // Adjust the path as needed
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentUpdate;
