import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Community() {
  const navigate = useNavigate();

  const handleDepartmentClick = (department) => {
    navigate(`/department/${department}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Community</h1>
          <p className="text-gray-600 mb-6">Connect with students from different departments</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['Computer', 'IT', 'Mechanical', 'Civil', 'Electronics', 'Electrical'].map((dept) => (
            <div key={dept} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
              <div className="text-indigo-500 mb-3">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{dept}</h3>
              <p className="text-gray-600 text-sm mb-4">Connect with {dept} department students</p>
              <button 
                onClick={() => handleDepartmentClick(dept)}
                className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                View Posts
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
