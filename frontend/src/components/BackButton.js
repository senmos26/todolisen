import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center text-blue-500 hover:text-blue-700"
    >
      <FaArrowLeft className="mr-2" />
      Back
    </button>
  );
};

export default BackButton;
