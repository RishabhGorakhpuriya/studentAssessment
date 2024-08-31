import axios from 'axios';
import { useState } from 'react';
import SideBar from './SideBar';

function AssessmentForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Replace with your actual API URL
            const response = await axios.post('http://localhost:4000/api/assessment/createAssessment', {
                title,
                description,
                dueDate,
                isActive
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
                }
            });

            console.log(response.data); // Handle the response data as needed
            setSuccess('Assessment created successfully!');
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to create assessment. Please try again.');
            setSuccess(null);
        }
    };

    return (
        <div className="flex flex-row h-screen">
            <aside className="w-50">
                <SideBar />
            </aside>
            <div className="w-full m-5 p-20 bg-white rounded-lg shadow-lg ">
                <form onSubmit={handleSubmit} className=''>
                    <div>
                        <h2 className="text-4xl font-extrabold leading-tight text-gray-900 mb-8">Create Assessment</h2>
                        <p className="text-lg leading-8 text-gray-600 mb-8">
                            Please fill out the form to create a new assessment. Ensure all required fields are completed.
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

                            {/* Uncomment and implement this if needed */}
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
                            onClick={() => { /* Handle cancel logic */ }}
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
}

export default AssessmentForm;
