import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SideBar from './SideBar';
import { FaPen } from "react-icons/fa6";

const Modal = ({ isOpen, onClose, name, email, selectedStudent }) => {

    const [score, setScore] = useState(selectedStudent.score || 0);
    const [feedback, setFeedback] = useState(selectedStudent.feedback || '');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const nevigate = useNavigate();
    const {id} = useParams();
    useEffect(() => {
        setScore(selectedStudent?.score || 0);
        setFeedback(selectedStudent?.feedback || '');
    }, [selectedStudent]);

    const handleSend = async () => {
        setSending(true);
        setError('');
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

            // Convert score to number
            const scoreNumber = Number(score);

            // Ensure score is valid
            if (isNaN(scoreNumber)) {
                throw new Error('Invalid score');
            }

            const response = await axios.put(`http://localhost:4000/api/updateResult/${selectedStudent.id}`, { score: scoreNumber, feedback }, config);

            console.log('Assessment updated:', response.data);
            onClose(); // Close the modal on success
            nevigate(`/studentfeedback/${id}`)
        } catch (err) {
            setError('Error updating assessment. Please try again.');
            console.error('Error sending assessments:', err);
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl h-auto max-h-[80vh] overflow-y-auto flex flex-col">
                <p className="text-2xl text-gray-600 mb-2">Student Name: {name}</p>
                <p className="text-2xl text-gray-600 mb-2">Email: {email}</p>
                <p className="text-2xl text-gray-600 mb-2">Assessment Name: {selectedStudent ? selectedStudent.assessmentId.title : ""}</p>

                <div className="mt-6">
                    <label htmlFor="score" className="block text-lg font-semibold text-gray-700 mb-2">
                        Score:
                    </label>
                    <input
                        type="number"
                        id="score"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                        placeholder="Enter score"
                    />
                </div>

                <div className="mt-6">
                    <label htmlFor="feedback" className="block text-lg font-semibold text-gray-700 mb-2">
                        Feedback:
                    </label>
                    <textarea
                        id="feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="Enter feedback"
                        rows="4"
                    ></textarea>
                </div>

                {error && <p className="text-red-500 mt-4">{error}</p>}

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
                        {sending ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </div>
        </div>
    );
};




const StudentFeedback = () => {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    // const [selectedUser, setSelectedUser] = useState(null);
    // const navigate = useNavigate();
    const { id } = useParams();
    console.log(selectedStudent)
    useEffect(() => {
        const fetchStudents = async () => {
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
                setStudents(response.data);
                console.log(response.data);
                console.log('API response:', response.data); // Debugging: Check API response
            } catch (err) {
                setError(err.message);
            }
        };

        fetchStudents();
    }, [id]);

    // useEffect(() => {
    //     setIsModalOpen(true);
    // }, [selectedStudent])

    const handleOpenModal = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
        setStudents(student)
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const fullName = localStorage.getItem('fullName')
    const emailId = localStorage.getItem('emailId');
    return (
        <div className="flex flex-row h-screen">
            <aside className="w-50">
                <SideBar />
            </aside>
            <div className="w-full m-5 p-10 bg-white rounded-lg shadow-lg ">
                <h1 className="text-2xl font-bold mb-4">Student Assessments</h1>

                {error && <p className="text-red-500 mb-4">Error: {error}</p>}

                <div className="space-y-4">
                    {students.length === 0 ? (
                        <p>No students found.</p>
                    ) : (
                        Array.isArray(students) && students.map(student => (
                            <div key={student.studentId} className="bg-white shadow-md rounded-lg p-4">
                                <button className='float-right'><FaPen size={15} onClick={() => handleOpenModal(student)} className='float-right' /></button>
                                {/* <h2 className="text-xl font-semibold mb-2">Student ID: {student.studentId}</h2> */}
                                <h2 className="text-xl font-semibold mb-2">Student Name: {fullName}</h2>
                                <h2 className="text-xl font-semibold mb-2">Email : {emailId}</h2>
                                <li key={student.id} className="mt-5">
                                    <span className="font-medium text-xl">Assessment Title:  {student.assessmentId.title}</span>
                                    <span className="ml-4 font-medium text-xl">Score: {student.score || 'N/A'}</span>
                                    <span className="ml-4 font-medium text-xl">Feedback: {student.feedback || 'No feedback'}</span>
                                </li>

                            </div>

                        ))
                    )}

                    {selectedStudent && (
                        <Modal
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            name={fullName}
                            email={emailId}
                            selectedStudent={selectedStudent}
                        />
                    )}

                </div>



            </div>
        </div>
    );
};

export default StudentFeedback;
