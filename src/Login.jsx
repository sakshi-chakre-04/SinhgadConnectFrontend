import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from './services/api';
import { useAuth } from './context/AuthContext';


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
      // Validate email format
      if (!email.endsWith('@sinhgad.edu')) {
        throw new Error('Please use your @sinhgad.edu email to login');
      }

      const credentials = {
        email: email,
        password: password
      };

      const response = await authAPI.login(credentials);
      
      if (response && response.token && response.user) {
        // Use the auth context to login
        login(response.user, response.token, rememberMe);
        // Redirect to dashboard or home page
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <form className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">Login</h2>
        <p className="text-center text-gray-600 mb-6">Please sign in to continue.</p>
        
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your @sinhgad.edu email" className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors" />
        </div>
        <div className="mb-4 relative">
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Password" className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors pr-10" />
          <span className="absolute right-3 top-9 cursor-pointer select-none" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</span>
        </div>
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="rounded" />
            Remember me next time
          </label>
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:-translate-y-0.5 transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
        <div className="text-center mt-4 text-gray-600">
          Don't have an account? <Link to="/register" className="text-indigo-500 font-medium hover:underline">Sign Up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login; 