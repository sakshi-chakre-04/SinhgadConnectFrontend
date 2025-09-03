import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from './services/api';
import { useAuth } from './context/AuthContext';


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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <form className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">Register</h2>
        <p className="text-center text-gray-600 mb-6">Please register to login.</p>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Username</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required maxLength={50} placeholder="Enter your name" className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your @sinhgad.edu email" className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Department</label>
          <select value={department} onChange={e => setDepartment(e.target.value)} required className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors">
            <option value="">Select Department</option>
            {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Year</label>
          <select value={year} onChange={e => setYear(e.target.value)} required className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors">
            <option value="">Select Year</option>
            {years.map(yr => <option key={yr} value={yr}>{yr}</option>)}
          </select>
        </div>
        <div className="mb-4 relative">
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="Password" className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors pr-10" />
          <span className="absolute right-3 top-9 cursor-pointer select-none" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</span>
        </div>
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="rounded" />
            Remember me next time
          </label>
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:-translate-y-0.5 transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none" disabled={isLoading}>
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
        <div className="text-center mt-4 text-gray-600">
          Already have account? <Link to="/login" className="text-indigo-500 font-medium hover:underline">Sign In</Link>
        </div>
      </form>
    </div>
  );
};

export default Register; 