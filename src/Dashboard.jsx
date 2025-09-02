import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './AuthForm.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Welcome, {user.name}! 🎉</h2>
        <p>You have successfully logged in to Sinhgad Connect.</p>
        
        <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Department:</strong> {user.department}</p>
          <p><strong>Year:</strong> {user.year}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;