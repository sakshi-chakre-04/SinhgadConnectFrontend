# Sinhgad Connect Frontend

A React-based frontend application for Sinhgad Connect, featuring user authentication and social networking capabilities.

## Features

- **User Authentication**
  - User registration with validation
  - User login with JWT tokens
  - Remember me functionality
  - Secure token storage
  - Protected routes

- **Responsive Design**
  - Mobile-first approach
  - Works on both desktop and mobile devices
  - Modern, clean UI matching the provided template

- **Backend Integration**
  - RESTful API integration
  - JWT-based authentication
  - Real-time form validation
  - Error handling and user feedback

## Prerequisites

- Node.js 20.19.0 or higher
- npm or yarn package manager
- Backend server running on port 5000

## Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd SinhgadConnectFrontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:5173
   ```

## Backend Connectivity

### API Endpoints

The frontend connects to the following backend endpoints:

- **Authentication:**
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User login
  - `GET /api/auth/me` - Get current user (protected)

- **Posts:**
  - `GET /api/posts` - Get all posts
  - `POST /api/posts` - Create new post (protected)

- **Comments:**
  - `GET /api/comments/:postId` - Get comments for a post
  - `POST /api/comments` - Add comment to a post (protected)

### Backend Requirements

Ensure your backend server is:
- Running on port 5000
- Has CORS enabled
- Has the required environment variables set (JWT_SECRET, MONGODB_URI)
- MongoDB connection is active

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── comments/       # Comment-related components
├── context/            # React Context providers
│   └── AuthContext.jsx # Authentication state management
├── services/           # API service functions
│   └── api.js         # Backend API integration
├── App.jsx            # Main application component
├── Login.jsx          # Login page component
├── Register.jsx       # Registration page component
├── Dashboard.jsx      # Dashboard after login
├── AuthForm.css       # Shared authentication styles
└── main.jsx          # Application entry point
```

## Usage

### Registration Flow

1. Navigate to `/register`
2. Fill in the required fields:
   - Username (max 50 characters)
   - Email (must be @sinhgad.edu)
   - Password (min 6 characters)
   - Department (select from dropdown)
   - Year (select from dropdown)
3. Check "Remember me" if desired
4. Click "Sign Up"
5. Upon success, you'll be redirected to the dashboard

### Login Flow

1. Navigate to `/login`
2. Enter your credentials:
   - Email (must be @sinhgad.edu)
   - Password
3. Check "Remember me" if desired
4. Click "Sign In"
5. Upon success, you'll be redirected to the dashboard

### Authentication State

- **Local Storage:** Used when "Remember me" is checked (persists across browser sessions)
- **Session Storage:** Used when "Remember me" is unchecked (cleared when browser is closed)
- **JWT Token:** Automatically included in API requests for protected endpoints

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **New API Endpoints:** Add to `src/services/api.js`
2. **New Components:** Create in `src/components/`
3. **New Routes:** Add to `src/App.jsx`
4. **Styling:** Use `src/AuthForm.css` or create new CSS files

## Troubleshooting

### Common Issues

1. **"Vite requires Node.js version 20.19+" error:**
   - Upgrade Node.js to version 20.19.0 or higher

2. **"Cannot connect to backend" error:**
   - Ensure backend server is running on port 5000
   - Check if CORS is enabled on backend
   - Verify network connectivity

3. **"Email validation failed" error:**
   - Ensure email ends with `@sinhgad.edu`
   - Check email format is valid

4. **"Password too short" error:**
   - Ensure password is at least 6 characters long

### Debug Mode

To enable debug logging, add this to your browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## Contributing

1. Follow the existing code structure
2. Use consistent naming conventions
3. Add proper error handling
4. Test on both desktop and mobile devices
5. Ensure backend connectivity works

## License

This project is part of Sinhgad Connect and follows the project's licensing terms.
