import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider, useModal } from './context/ModalContext';
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

// Layout wrapper for authenticated routes
const AuthenticatedLayout = ({ children }) => {
  const { isModalOpen, closeModal, activeTab } = useModal();
  
  // Handle modal close with refresh option
  const handleCloseModal = (shouldRefresh = false) => {
    closeModal(shouldRefresh);
    
    // If we need to refresh the page content after closing the modal
    if (shouldRefresh && typeof window !== 'undefined') {
      // You can add any additional refresh logic here if needed
      console.log('Refreshing page content...');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      
      {/* Global ASKQues Modal - Rendered at the root level */}
      <div className="fixed z-[1000]">
        <ASKQues isOpen={isModalOpen} onClose={handleCloseModal} initialTab={activeTab} />
      </div>
    </div>
  );
};

// Move Community and Notifications components to separate files
// They are now imported from './Community' and './Notifications'

function App() {
  return (
    <Router>
      <AuthProvider>
        <ModalProvider>
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
        </ModalProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
