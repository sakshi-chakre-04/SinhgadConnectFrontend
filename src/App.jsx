import React, { useState, useCallback } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { store } from './store/store';
import { injectStore } from './services/api/api';
import { useModal } from './hooks/useModal';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/navbar';
import Sidebar from './components/layout/Sidebar';
import RightSidebar from './components/layout/RightSidebar';
import MobileNav from './components/layout/MobileNav';
import Posts from './components/posts/PostContainer';
import Community from './pages/Community';
import Notifications from './pages/Notifications';
import Department from './pages/Department';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';
import Search from './pages/Search';
import PostDetail from './pages/PostDetail';
import ASKQues from './components/askQues/ASKQues';
import EditProfile from './pages/EditProfile';
import Trending from './pages/Trending';
import HallOfFame from './pages/HallOfFame';
import Resources from './pages/Resources';
import ChatWidget from './components/chat/ChatWidget';
import { SocketProvider } from './context/SocketContext';

// Layout wrapper for authenticated routes
const AuthenticatedLayout = ({ children }) => {
  const { isModalOpen, openModal, closeModal } = useModal();
  const navigate = useNavigate();
  const location = useLocation();
  const [refreshKey, setRefreshKey] = useState(0);

  // Handle modal close with refresh option
  const handleCloseModal = useCallback((shouldRefresh = false) => {
    // Close the modal
    closeModal();

    // Handle refresh if needed - use soft navigation instead of full reload
    if (shouldRefresh) {
      // Update key to trigger re-render of children, then navigate to posts
      setRefreshKey(prev => prev + 1);
      // Navigate to posts page to see the new post
      if (location.pathname !== '/posts') {
        navigate('/posts');
      }
    }
  }, [closeModal, navigate, location.pathname]);


  return (
    <div className="min-h-screen bg-transparent">
      {/* Left Sidebar */}
      <Sidebar onCreatePost={openModal} />

      {/* Main Content Area */}
      <main className="lg:ml-[var(--sidebar-width)] xl:mr-[var(--right-sidebar-width)] min-h-screen pt-4 pb-24 lg:pb-8 px-4 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {children}
        </div>
      </main>

      {/* Right Sidebar */}
      <RightSidebar />

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Global Post Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000]" onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleCloseModal();
          }
        }}>
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
            <ASKQues
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}

      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  );
};

// Initialize API service with Redux store
injectStore(store);

function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes - all wrapped by ProtectedRoute */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<AuthenticatedLayout><Dashboard /></AuthenticatedLayout>} />
                <Route path="/posts" element={<AuthenticatedLayout><Posts /></AuthenticatedLayout>} />
                <Route path="/posts/:id" element={<AuthenticatedLayout><PostDetail /></AuthenticatedLayout>} />
                <Route path="/community" element={<AuthenticatedLayout><Community /></AuthenticatedLayout>} />
                <Route path="/notifications" element={<AuthenticatedLayout><Notifications /></AuthenticatedLayout>} />
                <Route path="/profile" element={<AuthenticatedLayout><Profile /></AuthenticatedLayout>} />
                <Route path="/edit-profile" element={<AuthenticatedLayout><EditProfile /></AuthenticatedLayout>} />
                <Route path="/trending" element={<AuthenticatedLayout><Trending /></AuthenticatedLayout>} />
                <Route path="/hall-of-fame" element={<AuthenticatedLayout><HallOfFame /></AuthenticatedLayout>} />
                <Route path="/resources" element={<AuthenticatedLayout><Resources /></AuthenticatedLayout>} />
                <Route path="/settings" element={<AuthenticatedLayout><Settings /></AuthenticatedLayout>} />
                <Route
                  path="/create-post"
                  element={<AuthenticatedLayout><Dashboard initialModalOpen={true} /></AuthenticatedLayout>}
                />
                <Route
                  path="/department/:departmentName"
                  element={<AuthenticatedLayout><Department /></AuthenticatedLayout>}
                />
                <Route
                  path="/search"
                  element={<AuthenticatedLayout><Search /></AuthenticatedLayout>}
                />
                <Route
                  path="/user/:userId"
                  element={<AuthenticatedLayout><UserProfile /></AuthenticatedLayout>}
                />
              </Route>

              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Catch all - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </SocketProvider>
    </Provider>
  );
}

export default App;
