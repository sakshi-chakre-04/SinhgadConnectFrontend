import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import CommentsExample from './components/comments/CommentsExample';
import Navbar from './components/Navbar';


// Posts component
import Posts from './components/Posts';

const Community = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Community</h1>
        <p className="text-gray-600 mb-6">Connect with students from different departments</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['Computer', 'IT', 'Mechanical', 'Civil', 'Electronics', 'Electrical'].map((dept) => (
          <div key={dept} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
            <div className="text-indigo-500 mb-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{dept}</h3>
            <p className="text-gray-600 text-sm mb-4">Connect with {dept} department students</p>
            <button className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors">
              View Posts
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Notifications = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Notifications</h1>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No notifications yet</h3>
          <p className="text-gray-600">You'll see notifications here when someone interacts with your posts</p>
        </div>
      </div>
    </div>
  </div>
);

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
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
