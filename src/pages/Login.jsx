import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError, selectAuthError, selectAuthLoading } from '../features/auth/authSlice';

// Email validation
const validateEmail = (value) => {
  if (!value) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
  if (!value.endsWith('@sinhgad.edu')) return 'Must be a sinhgad.edu email';
  return true;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);
  const isLoading = useSelector(selectAuthLoading);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rememberMe: false,
    },
  });

  // Clear success message after 5 seconds
  useEffect(() => {
    if (location.state?.message) {
      setTimeout(() => {
        navigate(location.pathname, { replace: true, state: {} });
      }, 5000);
    }
  }, [location.state, navigate]);

  // Simplified submit - just dispatch loginUser with all data
  const onSubmit = async (data) => {
    dispatch(clearError());
    
    const result = await dispatch(loginUser({
      email: data.email.trim(),
      password: data.password,
      rememberMe: data.rememberMe  // Pass rememberMe here!
    }));
    
    // Navigate on success
    if (loginUser.fulfilled.match(result)) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    }
  };

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
        noValidate
      >
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-center text-gray-600 mb-6">Please login to continue.</p>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        
        {/* Success Message */}
        {location.state?.message && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">
            {location.state.message}
          </div>
        )}
        
        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email', { validate: validateEmail })}
            placeholder="Enter your @sinhgad.edu email"
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: 'Password is required' })}
              placeholder="Enter your password"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors pr-10 ${
                errors.password ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        
        {/* Remember Me */}
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="rounded border-gray-300"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm text-indigo-500 hover:underline">
            Forgot password?
          </Link>
        </div>
        
        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:-translate-y-0.5 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        
        {/* Registration Link */}
        <div className="text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-500 font-medium hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
