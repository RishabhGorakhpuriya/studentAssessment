import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from './SideBar';
import { Link } from 'react-router-dom';

// Modal Component
const Modal = ({ isOpen, onClose, user }) => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchAssessments = async () => {
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

        const response = await axios.get('http://localhost:4000/api/assessment', config);
        setAssessments(response.data);
      } catch (err) {
        console.error('Error fetching assessments:', err);
        setError('Failed to fetch assessments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [user]);

  const handleCheckboxChange = (id) => {
    setSelectedAssessments((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((assessmentId) => assessmentId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSend = async () => {
    if (selectedAssessments.length === 0) {
      setSendError('No assessments selected.');
      return;
    }

    setSending(true);
    setSendError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(
        `http://localhost:4000/api/studentAssessment/${user.id}`, // Ensure user.id is the studentId
        selectedAssessments.map((id) => ({ assessmentId: id })),
        config
      );

      console.log('Successfully assigned assessments:', response.data);
      onClose(); // Close the modal on successful assignment
    } catch (err) {
      console.error('Error assigning assessments:', err);
      setSendError('Failed to assign assessments.');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl h-auto max-h-[80vh] overflow-y-auto flex flex-col">
        <h2 className="text-4xl font-semibold text-gray-800 mb-4">{user.fullName}</h2>
        <p className="text-2xl text-gray-600 mb-2">{user.emailId}</p>
        <p className="text-gray-400 text-sm mb-4">Created on: {new Date(user.createdAt).toLocaleDateString()}</p>

        {loading && <p>Loading assessments...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {sending && <p>Sending assessments...</p>}
        {sendError && <p className="text-red-500">{sendError}</p>}

        {assessments.length > 0 ? (
          <ul className="list-disc pl-5 mt-10">
            {Array.isArray(assessments) && assessments.map((assessment) => (
              <li key={assessment.id} className="mb-2 flex items-center">
                <input
                  type="checkbox"
                  checked={selectedAssessments.includes(assessment.id)}
                  onChange={() => handleCheckboxChange(assessment.id)}
                  className="mr-2 text-4xl"
                />
                <div className="mx-3 text-2xl mt-3">
                  <h3 className="font-bold">{assessment.title}</h3>
                  {assessment.description} (Due: {new Date(assessment.dueDate).toLocaleDateString()})
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No assessments found.</p>
        )}

        <div className="flex justify-between mt-auto">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};




// UserCard Component
const UserCard = ({ user, onOpenModal }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 m-2 max-w-sm w-full">
      <h2 className="text-xl font-semibold text-gray-800">{user.fullName}</h2>
      <p className="text-gray-600">{user.emailId}</p>
      <p className="text-gray-400 text-sm">Created on: {new Date(user.createdAt).toLocaleDateString()}</p>
      <button
        onClick={() => onOpenModal(user)}
        className="bg-blue-500 text-white px-4 m py-2 mt-4 rounded-lg hover:bg-blue-600 mr-4 mr-4">
        Send Assessment
      </button>
      <Link to={`/studentfeedback/${user.id}`}>
        <button
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-blue-600"
        >
          View Details
        </button>
      </Link>
    </div>
  );
};

// UserListPage Component
const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getUserList = async () => {
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

        const response = await axios.get('http://localhost:4000/auth/userList', config);
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users.');
        setLoading(false);
      }
    };

    getUserList();
  }, []);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-row h-screen">
      <aside className="w-50">
        <SideBar />
      </aside>
      <div className="w-full m-5 p-20 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Student Users</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-wrap">
          {Array.isArray(users) && users.map(user => (
            <UserCard
              key={user._id}
              user={user}
              onOpenModal={handleOpenModal}
            />
          ))}
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          user={selectedUser}
        />
      </div>
    </div>
  );
};

export default UserListPage;
