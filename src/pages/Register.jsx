import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, selectAuthError, selectAuthLoading } from '../features/auth/authSlice';
import MagicGradient from '../components/ui/MagicGradient';

const departments = ['Computer', 'IT', 'Mechanical', 'Civil', 'Electronics', 'Electrical'];
const years = ['FE', 'SE', 'TE', 'BE'];

// Email validation
const validateEmail = (value) => {
  if (!value) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
  if (!value.endsWith('@sinhgad.edu')) return 'Must be a sinhgad.edu email';
  return true;
};

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);
  const isLoading = useSelector(selectAuthLoading);

  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Simplified submit - just dispatch registerUser
  const onSubmit = async (data) => {
    const result = await dispatch(registerUser({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      department: data.department,
      year: data.year,
      role: 'student'
    }));

    // Navigate on success
    if (registerUser.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <MagicGradient>
      <div className="relative w-full max-w-md mx-auto lg:max-w-md">
        {/* AskAI-style card */}
        <div className="bg-white rounded-2xl border-2 border-violet-200 shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 lg:p-6" noValidate>
            {/* AI Orb Header */}
            <div className="text-center mb-4 lg:mb-6">
              <div className="relative mb-3 lg:mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 blur-xl opacity-40 animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="relative w-16 h-16 rounded-full bg-white border-2 border-white shadow-2xl flex items-center justify-center mx-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h1 className="text-3xl lg:text-4xl font-light text-gray-800 tracking-tight mb-2">
                Create <span className="font-light text-gray-800">Account</span>
              </h1>
              <p className="text-gray-500 text-sm tracking-widest uppercase flex items-center gap-2 justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-pulse" />
                Join Campus • Get Started
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Name Field */}
            <div className="mb-4 lg:mb-6">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-3 text-sm">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  {...register('name', {
                    required: 'Name is required',
                    maxLength: { value: 50, message: 'Name must be at most 50 characters' }
                  })}
                  placeholder="Enter your full name"
                  className={`w-full px-5 py-4 rounded-xl border-2 text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-300 ${errors.name ? 'border-red-300 bg-red-50' : 'border-violet-200 hover:border-violet-300 focus:border-violet-400'}`}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4 lg:mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-3 text-sm">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  {...register('email', { validate: validateEmail })}
                  placeholder="your.name@sinhgad.edu"
                  className={`w-full px-5 py-4 rounded-xl border-2 text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-300 ${errors.email ? 'border-red-300 bg-red-50' : 'border-violet-200 hover:border-violet-300 focus:border-violet-400'}`}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Department & Year Fields */}
            <div className="grid grid-cols-2 gap-4 mb-4 lg:mb-6">
              <div>
                <label htmlFor="department" className="block text-gray-700 font-medium mb-3 text-sm">
                  Department
                </label>
                <select
                  id="department"
                  {...register('department', { required: 'Department is required' })}
                  className={`w-full px-5 py-4 rounded-xl border-2 text-gray-900 focus:outline-none transition-all duration-300 ${errors.department ? 'border-red-300 bg-red-50' : 'border-violet-200 hover:border-violet-300 focus:border-violet-400'}`}
                >
                  <option value="" className="bg-white">Select</option>
                  {departments.map((dep) => (
                    <option key={dep} value={dep} className="bg-white">{dep}</option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-2 text-sm text-red-600">{errors.department.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="year" className="block text-gray-700 font-medium mb-3 text-sm">
                  Year
                </label>
                <select
                  id="year"
                  {...register('year', { required: 'Year is required' })}
                  className={`w-full px-5 py-4 rounded-xl border-2 text-gray-900 focus:outline-none transition-all duration-300 ${errors.year ? 'border-red-300 bg-red-50' : 'border-violet-200 hover:border-violet-300 focus:border-violet-400'}`}
                >
                  <option value="" className="bg-white">Select</option>
                  {years.map((yr) => (
                    <option key={yr} value={yr} className="bg-white">{yr}</option>
                  ))}
                </select>
                {errors.year && (
                  <p className="mt-2 text-sm text-red-600">{errors.year.message}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6 lg:mb-8">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-3 text-sm">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  placeholder="Create a strong password"
                  className={`w-full px-5 py-4 pr-12 rounded-xl border-2 text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-300 ${errors.password ? 'border-red-300 bg-red-50' : 'border-violet-200 hover:border-violet-300 focus:border-violet-400'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group mb-6"
            >
              <span className="relative z-10">{isLoading ? 'Creating Account...' : 'Sign Up'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 group-hover:from-violet-700 group-hover:to-fuchsia-700 transition-all duration-300" />
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* Login Link */}
            <div className="text-center text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-violet-600 hover:text-violet-700 transition-colors duration-200 hover:underline"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </MagicGradient>
  );
};

export default Register;
