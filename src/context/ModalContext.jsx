import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Add Question');
  const [modalProps, setModalProps] = useState({});

  // Reset modal state when route changes
  useEffect(() => {
    if (isModalOpen) {
      setIsModalOpen(false);
    }
  }, [location.pathname]);

  const openModal = useCallback((tab = 'Add Question', props = {}) => {
    setActiveTab(tab);
    setModalProps(props);
    setIsModalOpen(true);
    
    // Store the current path to restore after login if needed
    if (!window.location.pathname.startsWith('/login')) {
      sessionStorage.setItem('lastPathBeforeModal', window.location.pathname);
    }
  }, []);

  const closeModal = useCallback((shouldRefresh = false) => {
    setIsModalOpen(false);
    // Reset modal props when closing
    if (!shouldRefresh) {
      setModalProps({});
    }
    return shouldRefresh;
  }, []);

  return (
    <ModalContext.Provider 
      value={{ 
        isModalOpen, 
        openModal, 
        closeModal, 
        activeTab,
        modalProps
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
