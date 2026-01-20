import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, selectAuthError, selectAuthLoading } from '../features/auth/authSlice';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br p-4" style={{ background: 'linear-gradient(135deg, #C5BDE5 0%, #BAF0E8 30%, #D8C9E0 60%, #F5D89E 100%)' }}>
      <form
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">Register</h2>
        <p className="text-center mb-6" style={{ color: 'var(--gray-purple)' }}>Create your account</p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
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
              required: 'Name is required',
              maxLength: { value: 50, message: 'Name must be at most 50 characters' }
            })}
            placeholder="Enter your name"
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${errors.name ? 'border-red-500' : 'border-gray-200'
              }`}
            style={!errors.name ? { borderColor: 'var(--lavender-light)' } : {}}
            onFocus={(e) => !errors.name && (e.target.style.borderColor = 'var(--lavender-main)')}
            onBlur={(e) => !errors.name && (e.target.style.borderColor = 'var(--lavender-light)')}
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
            {...register('email', { validate: validateEmail })}
            placeholder="Enter your @sinhgad.edu email"
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-200'
              }`}
            style={!errors.email ? { borderColor: 'var(--lavender-light)' } : {}}
            onFocus={(e) => !errors.email && (e.target.style.borderColor = 'var(--lavender-main)')}
            onBlur={(e) => !errors.email && (e.target.style.borderColor = 'var(--lavender-light)')}
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
            {...register('department', { required: 'Department is required' })}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${errors.department ? 'border-red-500' : 'border-gray-200'
              }`}
            style={!errors.department ? { borderColor: 'var(--lavender-light)' } : {}}
            onFocus={(e) => !errors.department && (e.target.style.borderColor = 'var(--lavender-main)')}
            onBlur={(e) => !errors.department && (e.target.style.borderColor = 'var(--lavender-light)')}
          >
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
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
            {...register('year', { required: 'Year is required' })}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors ${errors.year ? 'border-red-500' : 'border-gray-200'
              }`}
            style={!errors.year ? { borderColor: 'var(--lavender-light)' } : {}}
            onFocus={(e) => !errors.year && (e.target.style.borderColor = 'var(--lavender-main)')}
            onBlur={(e) => !errors.year && (e.target.style.borderColor = 'var(--lavender-light)')}
          >
            <option value="">Select Year</option>
            {years.map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
          {errors.year && (
            <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
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
              placeholder="Enter your password"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none transition-colors pr-10 ${errors.password ? 'border-red-500' : 'border-gray-200'
                }`}
              style={!errors.password ? { borderColor: 'var(--lavender-light)' } : {}}
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full text-white py-3 rounded-lg font-semibold hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--yellow-accent)' }}
          onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = 'var(--lavender-main)')}
          onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = 'var(--yellow-accent)')}
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>

        {/* Login Link */}
        <div className="text-center mt-4" style={{ color: 'var(--gray-purple)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-medium hover:underline" style={{ color: 'var(--lavender-main)' }}>
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
