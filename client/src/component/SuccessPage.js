import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total } = location.state || { score: 0, total: 0 };

  return (
    <div className="flex w-full bg-gray-100 items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Assessment Complete</h1>
        <p className="text-lg mb-4">You scored {score} out of {total}.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Take Again
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
