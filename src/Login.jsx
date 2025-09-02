import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from './services/api';
import { useAuth } from './context/AuthContext';
import './AuthForm.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Show success message if redirected from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const credentials = {
        email,
        password
      };

      const response = await authAPI.login(credentials);
      
      // Use the auth context to login
      login(response.user, response.token, rememberMe);

      // Redirect to dashboard or home page
      navigate('/dashboard'); // You can change this to your desired route
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <p>Please sign in to continue.</p>
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <div className="input-group">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your @sinhgad.edu email" />
        </div>
        <div className="input-group password-group">
          <label>Password</label>
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Password" />
          <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</span>
        </div>
        <div className="options-row">
          <label className="remember-me">
            <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
            Remember me next time
          </label>
        </div>
        <button type="submit" className="auth-btn" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
        <div className="switch-link">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login; 