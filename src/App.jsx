import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './app/store';
import { injectStore } from './services/api';
import { useModal } from './hooks/useModal';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import CommentsExample from './components/comments/CommentsExample';
import Navbar from './components/Navbar';
import Posts from './components/Posts';
import Community from './Community';
import Notifications from './Notifications';
import Department from './Department';
import Profile from './Profile';
import Settings from './Settings';
import ASKQues from './components/ASKQues';
import EditProfile from './components/profile/EditProfile';

// Layout wrapper for authenticated routes
const AuthenticatedLayout = ({ children }) => {
  const { isModalOpen, closeModal, activeTab } = useModal();
  
  // Handle modal close with refresh option
  const handleCloseModal = (shouldRefresh = false) => {
    console.log('handleCloseModal called with shouldRefresh:', shouldRefresh);
    
    // Close the modal first
    closeModal({ shouldRefresh });
    
    // If we need to refresh the page content after closing the modal
    if (shouldRefresh && typeof window !== 'undefined') {
      console.log('Refreshing page content...');
      // You can add any additional refresh logic here if needed
      // For example, you might want to refetch data or reset some state
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      
      {/* Global ASKQues Modal - Rendered at the root level */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000]" onClick={(e) => {
          // Close modal when clicking outside the modal content
          if (e.target === e.currentTarget) {
            handleCloseModal();
          }
        }}>
          <div className="absolute inset-0 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
            <ASKQues 
              isOpen={isModalOpen} 
              onClose={handleCloseModal} 
              initialTab={activeTab} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Move Community and Notifications components to separate files
// They are now imported from './Community' and './Notifications'

// Initialize API service with Redux store
injectStore(store);

function App() {
  return (
    <Provider store={store}>
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
            <Route path="/profile" element={<AuthenticatedLayout><Profile /></AuthenticatedLayout>} />
            <Route path="/edit-profile" element={<AuthenticatedLayout><EditProfile /></AuthenticatedLayout>} />
            <Route path="/settings" element={<AuthenticatedLayout><Settings /></AuthenticatedLayout>} />
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
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
