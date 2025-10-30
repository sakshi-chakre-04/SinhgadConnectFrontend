# 🚀 Sinhgad Connect Frontend

A modern React-based frontend for Sinhgad Connect, a campus-exclusive social platform for SKNCOE students. Built with React 19, Vite, and TailwindCSS.

## ✨ Features

### 🔐 Authentication
- Email-based registration with @sinhgad.edu validation
- Secure JWT authentication
- Persistent sessions with "Remember me"
- Protected routes and role-based access

### 📱 Modern UI/UX
- Responsive design with TailwindCSS
- Dark/light mode support
- Interactive components with smooth animations
- Mobile-first approach

### 📝 Posts & Comments
- Create, read, update, and delete posts
- Rich text editor with CKEditor 5
- Nested comments with replies
- Upvote/downvote system
- Department-based filtering

### 🔔 Real-time Features
- WebSocket notifications
- Real-time post updates
- Comment threading
- Online status indicators

## 🛠 Tech Stack

### Core
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Redux Toolkit
- **Routing**: React Router v7

### Key Libraries
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Rich Text**: CKEditor 5
- **Icons**: Heroicons
- **UI Components**: Headless UI
- **Notifications**: React Toastify

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Backend server running (see backend setup)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/SinhgadConnectFrontend.git
   cd SinhgadConnectFrontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_WS_URL=ws://localhost:5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── assets/            # Static assets (images, icons)
├── components/        # Reusable UI components
│   ├── auth/         # Authentication components
│   ├── comments/     # Comment components
│   ├── layout/       # Layout components
│   └── posts/        # Post components
├── context/          # React Context providers
│   ├── AuthContext.jsx
│   └── ModalContext.jsx
├── features/         # Feature-based modules
│   ├── auth/         # Authentication slice
│   └── modal/        # Modal slice
├── services/         # API services
│   ├── api.js        # Base API configuration
│   ├── authAPI.js    # Auth API calls
│   ├── postsAPI.js   # Posts API calls
│   └── commentsAPI.js # Comments API calls
├── App.jsx           # Main application component
├── main.jsx          # Application entry point
└── index.css         # Global styles
```

## 📚 API Integration

The frontend integrates with the following API endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/me` - Update profile

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/vote` - Vote on post

### Comments
- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/vote` - Vote on comment

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/read-all` - Mark all as read
- `PUT /api/notifications/:id/read` - Mark as read

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Code Style
- Follows Airbnb JavaScript Style Guide
- 2-space indentation
- Single quotes for strings
- Semicolons
- Trailing commas in multiline objects/arrays

## 🧪 Testing

### Running Tests
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 🚀 Deployment

### Building for Production
```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

### Deployment Options
- **Vercel**: Recommended for easy deployment
- **Netlify**: Great for static hosting
- **AWS Amplify**: Full-stack deployment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- [Your Name] - Frontend Developer
- [Backend Developer]
- [Designer]

## 🙏 Acknowledgments

- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
