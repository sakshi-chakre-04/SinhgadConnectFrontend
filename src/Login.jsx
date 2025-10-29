import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError, selectAuthError, selectAuthLoading, setCredentials } from './features/auth/authSlice';

// Custom validation functions
const validateEmail = (value) => {
  if (!value) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
  if (!value.endsWith('@sinhgad.edu')) return 'Must be a sinhgad.edu email';
  return true;
};

const validatePassword = (value) => {
  if (!value) return 'Password is required';
  if (value.length < 6) return 'Password must be at least 6 characters';
  return true;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);
  const isLoading = useSelector(selectAuthLoading);
  
  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      rememberMe: false,
    },
  });

  // Show success message if redirected from registration
  useEffect(() => {
    if (location.state?.message) {
      // Show success message if redirected from registration
      setTimeout(() => {
        // Clear the message after 5 seconds
        navigate(location.pathname, { replace: true, state: {} });
      }, 5000);
    }
  }, [location.state, navigate]);

  const onSubmit = async (data) => {
    console.log('Login form submitted with data:', {
      ...data,
      password: '***' // Don't log actual password
    });
    
    // Clear any previous errors
    dispatch(clearError());
    
    try {
      console.log('Dispatching loginUser action');
      const resultAction = await dispatch(loginUser({ 
        email: data.email.trim(), // Ensure email is trimmed
        password: data.password
      }));
      
      console.log('Login result action:', resultAction);
      
      if (loginUser.fulfilled.match(resultAction)) {
        console.log('Login successful, setting credentials');
        // On successful login, set credentials with rememberMe preference
        const { user, token } = resultAction.payload;
        dispatch(setCredentials({ user, token, rememberMe: data.rememberMe }));
        
        // Redirect to dashboard or previous location
        const from = location.state?.from?.pathname || '/dashboard';
        console.log('Login successful, navigating to:', from);
        navigate(from);
      } else if (loginUser.rejected.match(resultAction)) {
        console.error('Login rejected:', resultAction.error);
        // The error is already handled by the authSlice
      }
    } catch (error) {
      console.error('Unexpected login error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Set a user-friendly error message
      setError('root', {
        type: 'manual',
        message: error.message || 'An unexpected error occurred during login.'
      });
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
        
        {/* Global Errors */}
        {(error || errors.root) && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error || errors.root?.message}
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
            {...register('email', {
              validate: validateEmail
            })}
            placeholder="Enter your @sinhgad.edu email"
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
            }`}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        {/* Password Field */}
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', {
                required: 'Password is required'
              })}
              placeholder="Enter your password"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors pr-10 ${
                errors.password ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
              }`}
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        
        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Remember me next time
          </label>
          <Link 
            to="/forgot-password" 
            className="text-sm text-indigo-500 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
          >
            Forgot password?
          </Link>
        </div>
        
        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting || isLoading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:-translate-y-0.5 transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isLoading || isSubmitting ? 'Logging in...' : 'Login'}
        </button>
        
        {/* Registration Link */}
        <div className="text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="text-indigo-500 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login; 