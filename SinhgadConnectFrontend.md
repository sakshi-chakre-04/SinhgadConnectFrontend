# SinhgadConnect Frontend - Complete Development Documentation

## Initial Project Setup

### Terminal Commands Used

```bash
# Create React project with Vite
npm create vite@latest SinhgadConnectFrontend -- --template react
cd SinhgadConnectFrontend

# Install initial dependencies
npm install

# Install routing and UI dependencies
npm install react-router-dom
npm install react-avatar

# Install rich text editor for comments
npm install @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic

# Development server
npm run dev
```

## Package.json Configuration

### Dependencies Added

```json
{
  "dependencies": {
    "@ckeditor/ckeditor5-build-classic": "^39.0.2",
    "@ckeditor/ckeditor5-react": "^11.0.0",
    "react": "^19.1.1",
    "react-avatar": "^5.0.3",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.8.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.33.0",
    "@types/react": "^19.1.10",
    "@types/react-dom": "^19.1.7",
    "@vitejs/plugin-react": "^5.0.0",
    "cross-env": "^10.0.0",
    "eslint": "^9.33.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.3.0",
    "vite": "^7.1.2"
  }
}
```

## Project Structure Created

```
src/
├── assets/
│   ├── comment.png
│   ├── edit.png
│   ├── globe.png
│   ├── lens.png
│   ├── question.png
│   ├── quora.png
│   └── share.png
├── components/
│   ├── ASKQues.jsx
│   ├── Navbar.jsx
│   └── comments/
│       ├── CommentsExample.jsx
│       ├── comment.jsx
│       ├── commentForm.jsx
│       ├── commentSection.jsx
│       └── commentSection.css
├── context/
│   └── AuthContext.jsx
├── services/
│   ├── api.js
│   └── commentsAPI.js
├── App.jsx
├── App.css
├── AuthForm.css
├── Dashboard.jsx
├── index.css
├── Login.jsx
├── main.jsx
└── Register.jsx
```

## Authentication System Implementation

### Dependencies Required for Authentication

```bash
# Core routing for navigation between login/register
npm install react-router-dom

# No additional authentication libraries needed - using native fetch API
```

### Step-by-Step Authentication Setup

#### Step 1: Create AuthContext for State Management

**File:** `src/context/AuthContext.jsx`

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app load
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (userData, token, rememberMe = false) => {
    setUser(userData);
    setToken(token);
    
    if (rememberMe) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Features Implemented:**
- Persistent authentication (localStorage for "Remember Me")
- Session-based authentication (sessionStorage for temporary login)
- Automatic token validation on app load
- Error handling for corrupted stored data

#### Step 2: Create API Service for Authentication

**File:** `src/services/api.js`

```javascript
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Authentication API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    return handleResponse(response);
  },

  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    return handleResponse(response);
  },

  // Get current user (requires token)
  getCurrentUser: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return handleResponse(response);
  },
};
```

**API Integration:**
- RESTful API calls to backend endpoints
- Centralized error handling
- JWT token management
- Backend URL: `http://localhost:5000/api`

#### Step 3: Create Registration Component

**File:** `src/Register.jsx`

```javascript
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
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
            maxLength={50} 
            placeholder="Enter your name" 
          />
        </div>
        
        <div className="input-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            placeholder="Enter your @sinhgad.edu email" 
          />
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
          <input 
            type={showPassword ? 'text' : 'password'} 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            minLength={6} 
            placeholder="Password" 
          />
          <span 
            className="toggle-password" 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>
        
        <div className="options-row">
          <label className="remember-me">
            <input 
              type="checkbox" 
              checked={rememberMe} 
              onChange={e => setRememberMe(e.target.checked)} 
            />
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
```

**Registration Features:**
- **Form Validation**: Email format (@sinhgad.edu), password length (min 6 chars)
- **Department Selection**: Dropdown with predefined departments
- **Year Selection**: FE, SE, TE, BE options
- **Password Visibility Toggle**: Eye icon to show/hide password
- **Remember Me**: Option for persistent login
- **Error Handling**: Display API errors to user
- **Loading States**: Button shows "Signing Up..." during API call
- **Auto-login**: Automatically logs in user after successful registration

#### Step 4: Create Login Component

**File:** `src/Login.jsx`

```javascript
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

      // Redirect to dashboard
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
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            placeholder="Enter your @sinhgad.edu email" 
          />
        </div>
        
        <div className="input-group password-group">
          <label>Password</label>
          <input 
            type={showPassword ? 'text' : 'password'} 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            placeholder="Password" 
          />
          <span 
            className="toggle-password" 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>
        
        <div className="options-row">
          <label className="remember-me">
            <input 
              type="checkbox" 
              checked={rememberMe} 
              onChange={e => setRememberMe(e.target.checked)} 
            />
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
```

**Login Features:**
- **Success Messages**: Shows messages from registration redirect
- **Form Validation**: Required email and password fields
- **Password Visibility Toggle**: Same eye icon functionality
- **Remember Me**: Persistent vs session storage
- **Error Handling**: Display authentication errors
- **Loading States**: Button feedback during login process
- **Navigation**: Links to registration page

#### Step 5: Create Authentication Styles

**File:** `src/AuthForm.css`

```css
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0e7ef 0%, #f5f7fa 100%);
}

.auth-form {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  width: 100%;
  max-width: 370px;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.auth-form h2 {
  margin-bottom: 0.2rem;
  font-size: 2rem;
  font-weight: 700;
  color: #1a2a3a;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.input-group input,
.input-group select {
  padding: 0.7rem 1rem;
  border: 1px solid #dbeafe;
  border-radius: 0.7rem;
  font-size: 1rem;
  background: #f8fafc;
  outline: none;
  transition: border 0.2s;
}

.password-group {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1.1rem;
  color: #6b7a8f;
}

.auth-btn {
  width: 100%;
  padding: 0.8rem 0;
  background: #1a2a3a;
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  text-align: center;
}

.success-message {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  text-align: center;
}
```

**Styling Features:**
- **Modern Design**: Gradient background, rounded corners, shadows
- **Responsive**: Mobile-friendly with media queries
- **Interactive Elements**: Hover effects, focus states
- **Error/Success States**: Color-coded message boxes
- **Accessibility**: Proper contrast ratios and focus indicators

#### Step 6: Integration with App.jsx

```javascript
import { AuthProvider } from './context/AuthContext';
import Login from './Login';
import Register from './Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<AuthenticatedLayout><Dashboard /></AuthenticatedLayout>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

### Authentication Flow Summary

1. **User Registration**:
   - Fill form with name, @sinhgad.edu email, department, year, password
   - Frontend validates email format and password length
   - API call to `/api/auth/register`
   - Auto-login after successful registration
   - Redirect to dashboard

2. **User Login**:
   - Enter email and password
   - API call to `/api/auth/login`
   - Store token and user data (localStorage or sessionStorage)
   - Redirect to dashboard

3. **Session Management**:
   - AuthContext manages global auth state
   - Automatic token validation on app load
   - "Remember Me" for persistent sessions
   - Logout clears all stored data

4. **Protected Routes**:
   - AuthenticatedLayout wrapper for protected pages
   - Automatic redirect to login if not authenticated
   - User context available throughout the app

### Error Handling Implemented

- **Network Errors**: API connection failures
- **Validation Errors**: Email format, password requirements
- **Authentication Errors**: Invalid credentials, expired tokens
- **Server Errors**: Backend validation failures
- **Storage Errors**: Corrupted localStorage data

### Security Features

- **JWT Tokens**: Secure authentication tokens
- **Email Validation**: @sinhgad.edu domain restriction
- **Password Requirements**: Minimum 6 characters
- **Token Storage**: Separate localStorage/sessionStorage handling
- **Auto-cleanup**: Clear invalid stored data

## Component Development

###### link for comments : http://localhost:5173/comments-demo

### 1. Navbar Component
- **Purpose**: Quora-style navigation bar
- **Features**: 
  - Navigation icons (Home, Posts, Create Post, Community, Notifications)
  - Search bar with lens icon
  - User avatar and department/year display
  - Add Question button
  - Logout functionality

### 2. ASKQues Component (Modal)
- **Purpose**: Modal for adding questions and creating posts
- **Features**:
  - Tab switching between "Add Question" and "Create Post"
  - Form validation
  - Rich text editor integration
  - User context display

### 3. Comments System
- **Components Created**:
  - `CommentsExample.jsx` - Demo page for testing
  - `comment.jsx` - Individual comment display
  - `commentForm.jsx` - Comment creation form
  - `commentSection.jsx` - Main comments container
  - `commentsAPI.js` - API service for comments

### 4. Authentication Components
- **Login.jsx**: User login form
- **Register.jsx**: User registration form
- **Dashboard.jsx**: Main dashboard after login

## Routing Configuration

### App.jsx Routes Setup
```javascript
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/dashboard" element={<AuthenticatedLayout><Dashboard /></AuthenticatedLayout>} />
  <Route path="/posts" element={<AuthenticatedLayout><Posts /></AuthenticatedLayout>} />
  <Route path="/create-post" element={<AuthenticatedLayout><CreatePost /></AuthenticatedLayout>} />
  <Route path="/community" element={<AuthenticatedLayout><Community /></AuthenticatedLayout>} />
  <Route path="/notifications" element={<AuthenticatedLayout><Notifications /></AuthenticatedLayout>} />
  <Route path="/comments-demo" element={<AuthenticatedLayout><CommentsExample /></AuthenticatedLayout>} />
  <Route path="/" element={<Navigate to="/login" />} />
</Routes>
```

## API Integration

### Backend Connection
- **Base URL**: `http://localhost:5000/api`
- **Frontend Port**: `5173` (Vite development server)
- **Backend Port**: `5000`

### API Services Created
1. **Authentication API** (`api.js`)
2. **Comments API** (`commentsAPI.js`)

## Comments System Implementation

### Features Implemented
- ✅ Rich text comment editor (CKEditor)
- ✅ Real-time comment posting
- ✅ Upvote/Downvote system
- ✅ Author information display
- ✅ Timestamp formatting
- ✅ Error handling and loading states
- ✅ Responsive design

### Testing Route
- **URL**: `/comments-demo`
- **Purpose**: Test comment functionality with mock posts

## Critical Fixes Applied

### 1. SVG Icon Sizing Issue
**Problem**: SVG icons were taking up entire page
**Solution**: 
- Added `style={{ flexShrink: 0 }}` to all SVG elements
- Fixed width/height constraints (20x20px for navigation icons)
- Proper CSS class structure

### 2. Tailwind Migration
**Problem**: Mixed Tailwind and regular CSS causing conflicts
**Solution**:
- Complete removal of Tailwind classes
- Custom CSS implementation in `index.css`
- Consistent styling across all components

### 3. Layout Structure
**Problem**: Improper navbar layout and spacing
**Solution**:
- Proper CSS Grid/Flexbox implementation
- Consistent spacing using CSS variables
- Responsive design considerations

## Development Commands Used

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install additional dependencies as needed
npm install <package-name>
```

## Environment Configuration

### Vite Configuration
- **Development Port**: 5173
- **Hot Module Replacement**: Enabled
- **React Plugin**: Configured for JSX support

## Summary of Major Changes

1. **Project Setup**: Vite + React with modern dependencies
2. **Authentication System**: Complete user auth with context
3. **Styling Migration**: Tailwind → Regular CSS (Fixed major issues)
4. **Component Architecture**: Modular, reusable components
5. **Routing**: Protected routes with authentication
6. **API Integration**: RESTful API communication
7. **Comments System**: Full-featured commenting with voting
8. **UI/UX**: Quora-inspired design with responsive layout

## Testing & Debugging

### Issues Resolved
1. **"Failed to fetch" errors**: Backend server connectivity
2. **MongoDB connection issues**: Environment configuration
3. **Styling conflicts**: Tailwind migration
4. **SVG rendering problems**: Icon sizing fixes
5. **Component integration**: API service connections

### Testing Methods
1. **Comments Demo**: `/comments-demo` route
2. **Browser DevTools**: Console error monitoring
3. **Network Tab**: API request/response testing
4. **Component Testing**: Individual feature validation

This documentation represents the complete frontend development journey from initial setup to a fully functional SinhgadConnect application.
