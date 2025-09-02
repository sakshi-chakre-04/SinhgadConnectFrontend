import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import CommentsExample from './components/comments/CommentsExample';
import Navbar from './components/Navbar';
import './App.css';

// Placeholder components for new routes
const Posts = () => <div className="p-8"><h1 className="text-2xl font-bold">Posts</h1><p>Posts feed coming soon...</p></div>;
const CreatePost = () => <div className="p-8"><h1 className="text-2xl font-bold">Create Post</h1><p>Create post functionality coming soon...</p></div>;
const Community = () => <div className="p-8"><h1 className="text-2xl font-bold">Community</h1><p>Community features coming soon...</p></div>;
const Notifications = () => <div className="p-8"><h1 className="text-2xl font-bold">Notifications</h1><p>Notifications coming soon...</p></div>;

// Layout wrapper for authenticated routes
const AuthenticatedLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
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
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
