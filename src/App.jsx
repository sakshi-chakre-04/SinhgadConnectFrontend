import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import CommentsExample from './components/comments/CommentsExample';
import Navbar from './components/Navbar';
import Posts from './components/Posts';
import Community from './Community';
import Notifications from './Notifications';
import Department from './Department';

// Layout wrapper for authenticated routes
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
    </div>
  );
};

// Move Community and Notifications components to separate files
// They are now imported from './Community' and './Notifications'

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<AuthenticatedLayout><Dashboard /></AuthenticatedLayout>} />
            <Route path="/posts" element={<AuthenticatedLayout><Posts /></AuthenticatedLayout>} />
            {/* Create Post is now handled by the ASKQues modal */}
            <Route path="/community" element={<AuthenticatedLayout><Community /></AuthenticatedLayout>} />
            <Route path="/notifications" element={<AuthenticatedLayout><Notifications /></AuthenticatedLayout>} />
            <Route path="/comments-demo" element={<AuthenticatedLayout><CommentsExample /></AuthenticatedLayout>} />
            {/* Redirect /create-post to dashboard with modal state */}
            <Route 
              path="/create-post" 
              element={
                <AuthenticatedLayout>
                  <Dashboard initialModalOpen={true} />
                </AuthenticatedLayout>
              } 
            />
            <Route 
              path="/department/:departmentName" 
              element={
                <AuthenticatedLayout>
                  <Department />
                </AuthenticatedLayout>
              } 
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
