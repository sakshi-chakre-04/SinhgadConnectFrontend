import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from './services/api';
import { useAuth } from './context/AuthContext';
import './AuthForm.css';

const departments = ['Computer', 'IT', 'Mechanical', 'Civil', 'Electronics', 'Electrical'];
const years = ['FE', 'SE', 'TE', 'BE'];

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate email format
      if (!email.endsWith('@sinhgad.edu')) {
        throw new Error('Email must be a valid @sinhgad.edu address');
      }

      // Validate password length
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const userData = {
        name,
        email,
        password,
        department,
        year
      };

      const response = await authAPI.register(userData);
      
      // Use the auth context to login after successful registration
      login(response.user, response.token, rememberMe);

      // Redirect to dashboard after successful registration
      navigate('/dashboard');
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <p>Please register to login.</p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <div className="input-group">
          <label>Username</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required maxLength={50} placeholder="Enter your name" />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your @sinhgad.edu email" />
        </div>
        <div className="input-group">
          <label>Department</label>
          <select value={department} onChange={e => setDepartment(e.target.value)} required>
            <option value="">Select Department</option>
            {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label>Year</label>
          <select value={year} onChange={e => setYear(e.target.value)} required>
            <option value="">Select Year</option>
            {years.map(yr => <option key={yr} value={yr}>{yr}</option>)}
          </select>
        </div>
        <div className="input-group password-group">
          <label>Password</label>
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="Password" />
          <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</span>
        </div>
        <div className="options-row">
          <label className="remember-me">
            <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
            Remember me next time
          </label>
        </div>
        <button type="submit" className="auth-btn" disabled={isLoading}>
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
        <div className="switch-link">
          Already have account? <Link to="/login">Sign In</Link>
        </div>
      </form>
    </div>
  );
};

export default Register; 