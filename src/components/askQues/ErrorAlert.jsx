import React from 'react';

const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">
      {message}
    </div>
  );
};

export default ErrorAlert;
