import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError, selectAuthError, selectAuthLoading } from '../features/auth/authSlice';
import { useTheme } from '../context/ThemeContext';

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
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { isDarkMode } = useTheme();

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

  // Submit with cold start retry logic
  const onSubmit = async (data) => {
    dispatch(clearError());
    setIsWakingUp(false);

    const result = await dispatch(loginUser({
      email: data.email.trim(),
      password: data.password,
      rememberMe: data.rememberMe
    }));

    // Navigate on success
    if (loginUser.fulfilled.match(result)) {
      setRetryCount(0);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    } else if (loginUser.rejected.match(result) && retryCount < 1) {
      // First failure - likely cold start, retry automatically
      setIsWakingUp(true);
      setRetryCount(prev => prev + 1);

      // Wait 3 seconds then retry
      setTimeout(async () => {
        const retryResult = await dispatch(loginUser({
          email: data.email.trim(),
          password: data.password,
          rememberMe: data.rememberMe
        }));

        setIsWakingUp(false);
        if (loginUser.fulfilled.match(retryResult)) {
          setRetryCount(0);
          const from = location.state?.from?.pathname || '/dashboard';
          navigate(from);
        }
      }, 3000);
    }
  };

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br p-4"
      style={{
        background: isDarkMode
          ? 'linear-gradient(135deg, #0F090E 0%, #352438 50%, #0F090E 100%)'
          : 'linear-gradient(135deg, #B8ADE0 0%, #D4DBEE 50%, #E8C9DB 100%)'
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 rounded-xl shadow-2xl w-full max-w-md"
        style={{
          backgroundColor: isDarkMode ? '#352438' : 'white'
        }}
        noValidate
      >
        <h2 className="text-center text-2xl font-bold mb-2" style={{ color: isDarkMode ? 'white' : '#1f2937' }}>Welcome Back</h2>
        <p className="text-center mb-6" style={{ color: isDarkMode ? '#D4DBEE' : 'var(--gray-purple)' }}>Please login to continue.</p>

        {/* Server Waking Up Message */}
        {isWakingUp && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-lg mb-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <p className="font-medium">Waking up server...</p>
                <p className="text-xs text-amber-600 mt-0.5">Free hosting sleeps after inactivity. Just a few seconds!</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message - only show if not waking up */}
        {error && !isWakingUp && (
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
          <label htmlFor="email" className="block font-medium mb-2" style={{ color: isDarkMode ? 'white' : '#374151' }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email', { validate: validateEmail })}
            placeholder="Enter your @sinhgad.edu email"
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
            style={!errors.email ? {
              borderColor: 'var(--lavender-light)',
              backgroundColor: isDarkMode ? '#0F090E' : 'white',
              color: isDarkMode ? 'white' : 'black'
            } : {
              backgroundColor: isDarkMode ? '#0F090E' : 'white',
              color: isDarkMode ? 'white' : 'black'
            }}
            onFocus={(e) => !errors.email && (e.target.style.borderColor = 'var(--lavender-main)')}
            onBlur={(e) => !errors.email && (e.target.style.borderColor = 'var(--lavender-light)')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block font-medium mb-2" style={{ color: isDarkMode ? 'white' : '#374151' }}>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: 'Password is required' })}
              placeholder="Enter your password"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors pr-10 ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
              style={!errors.password ? {
                borderColor: 'var(--lavender-light)',
                backgroundColor: isDarkMode ? '#0F090E' : 'white',
                color: isDarkMode ? 'white' : 'black'
              } : {
                backgroundColor: isDarkMode ? '#0F090E' : 'white',
                color: isDarkMode ? 'white' : 'black'
              }}
              onFocus={(e) => !errors.password && (e.target.style.borderColor = 'var(--lavender-main)')}
              onBlur={(e) => !errors.password && (e.target.style.borderColor = 'var(--lavender-light)')}
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
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: isDarkMode ? '#D4DBEE' : 'var(--gray-purple)' }}>
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="rounded border-gray-300"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm hover:underline" style={{ color: 'var(--lavender-main)' }}>
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full text-white py-3 rounded-lg font-semibold hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--yellow-accent)' }}
          onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = 'var(--lavender-main)')}
          onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = 'var(--yellow-accent)')}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        {/* Registration Link */}
        <div className="text-center mt-4" style={{ color: isDarkMode ? '#D4DBEE' : 'var(--gray-purple)' }}>
          Don't have an account?{' '}
          <Link to="/register" className="font-medium hover:underline" style={{ color: 'var(--lavender-main)' }}>
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
