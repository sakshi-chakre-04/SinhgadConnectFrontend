import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError, selectAuthError, selectAuthLoading, setCredentials } from './features/auth/authSlice';

const departments = ['Computer', 'IT', 'Mechanical', 'Civil', 'Electronics', 'Electrical'];
const years = ['FE', 'SE', 'TE', 'BE'];

// Custom validation functions
const validateEmail = (value) => {
  if (!value) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
  if (!value.endsWith('@sinhgad.edu')) return 'Must be a sinhgad.edu email';
  return true;
};

const validateName = (value) => {
  if (!value) return 'Name is required';
  if (value.length > 50) return 'Name must be at most 50 characters';
  return true;
};

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);
  const isLoading = useSelector(selectAuthLoading);
  
  const [showPassword, setShowPassword] = React.useState(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    watch,
  } = useForm({
    defaultValues: {
      rememberMe: false,
    },
  });
  
  // Watch password for confirmation
  const password = watch('password');

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      // Format the data to match backend expectations
      const userData = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        department: data.department,
        year: data.year,
        role: 'student' // Add default role
      };

      console.log('Submitting registration with data:', userData);
      
      const resultAction = await dispatch(registerUser(userData));
      
      if (registerUser.fulfilled.match(resultAction)) {
        // On successful registration, set credentials with rememberMe preference
        const { user, token } = resultAction.payload;
        dispatch(setCredentials({ user, token, rememberMe: data.rememberMe }));
        
        // Reset form and redirect to dashboard
        clearErrors();
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('root', {
        type: 'manual',
        message: error?.message || 'Registration failed. Please check your details and try again.'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <form 
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md" 
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">Register</h2>
        <p className="text-center text-gray-600 mb-6">Please register to login.</p>
        
        {/* Global Form Error */}
        {(error || errors.root) && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error || errors.root?.message}
          </div>
        )}

        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Username
          </label>
          <input
            id="name"
            type="text"
            {...register('name', {
              validate: validateName
            })}
            placeholder="Enter your name"
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
              errors.name ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
            }`}
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

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

        {/* Department Field */}
        <div className="mb-4">
          <label htmlFor="department" className="block text-gray-700 font-medium mb-2">
            Department
          </label>
          <select
            id="department"
            {...register('department', {
              required: 'Department is required'
            })}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
              errors.department ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
            }`}
            aria-invalid={errors.department ? 'true' : 'false'}
          >
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
          )}
        </div>

        {/* Year Field */}
        <div className="mb-4">
          <label htmlFor="year" className="block text-gray-700 font-medium mb-2">
            Year
          </label>
          <select
            id="year"
            {...register('year', {
              required: 'Year is required'
            })}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
              errors.year ? 'border-red-500' : 'border-gray-200 focus:border-indigo-500'
            }`}
            aria-invalid={errors.year ? 'true' : 'false'}
          >
            <option value="">Select Year</option>
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
          {errors.year && (
            <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
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
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
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

        {/* Remember Me */}
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Remember me next time
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:-translate-y-0.5 transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>

        {/* Login Link */}
        <div className="text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-500 font-medium hover:underline">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;