import React from 'react';
import { FaEdit } from 'react-icons/fa';
import SideBar from './SideBar';

const UserProfile = () => {
    // Example user data
    const fullName = localStorage.getItem('fullName');
    const emailId = localStorage.getItem('emailId');
    const Role = localStorage.getItem('role');
    const date = localStorage.getItem('date');
    return (
        <div className="flex flex-row h-screen">
            <aside className="w-50">
                <SideBar />
            </aside>
            <div className="w-full m-5 p-20 bg-white rounded-lg shadow-lg ">
                {/* <div className="min-h-screen bg-gray-100">
                    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6"> */}
                {/* Profile Header */}
                <div className="flex items-center space-x-6">
                    <img
                        src={"https://via.placeholder.com/150"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
                        <p className="text-2xl text-gray-600">{emailId}</p>
                        <p className="text-gray-700 mt-2">{}</p>
                        <button className="mt-4 text-blue-500 flex items-center space-x-2 hover:underline">
                            <FaEdit />
                            <span>Edit Profile</span>
                        </button>
                    </div>
                </div>

                {/* User Details */}
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold text-gray-800">Details</h2>
                    <div className="mt-4 space-y-4">
                        {/* Example user details */}
                        <div className="flex justify-start">
                            <span className=" text-4xl text-gray-600">Username:</span>
                            <span className="text-4xl font-semibold mx-4">{fullName}</span>
                        </div>
                        <div className="flex justify-start">
                            <span className="text-4xl text-gray-600">Role : </span>
                            <span className="text-4xl font-semibold mx-4">{Role}</span>
                        </div>
                        <div className="flex justify-start">
                            <span className="text-4xl text-gray-600">Joined:</span>
                            <span className="text-4xl font-semibold mx-4">{new Date(date).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        //     </div>
        // </div>
    );
};

export default UserProfile;


//  {/* Additional Sections
//                 <div className="mt-6">
//                     <h2 className="text-2xl font-semibold text-gray-800">Recent Activity</h2>
//                     <div className="mt-4">
//                         {/* Example activity items */}
//                         <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
//                             <h3 className="text-lg font-semibold text-gray-700">Completed Project X</h3>
//                             <p className="text-gray-600">Completed the final milestone for Project X and submitted the report.</p>
//                             <span className="text-gray-500 text-sm">2 days ago</span>
//                         </div>
//                         <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
//                             <h3 className="text-lg font-semibold text-gray-700">Started New Course</h3>
//                             <p className="text-gray-600">Enrolled in an advanced React course to improve frontend skills.</p>
//                             <span className="text-gray-500 text-sm">1 week ago</span>
//                         </div>
//                     </div>
//                 </div> */}