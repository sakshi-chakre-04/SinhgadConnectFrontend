import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useCallback } from 'react';
import { closeModal, openModal, selectActiveTab, selectIsModalOpen, selectModalProps, resetModal } from '../features/modal/modalSlice';

export const useModal = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isModalOpen = useSelector(selectIsModalOpen);
  const activeTab = useSelector(selectActiveTab);
  const modalProps = useSelector(selectModalProps);
  const locationRef = useRef(location.pathname);

  // Reset modal state when route changes
  useEffect(() => {
    if (location.pathname !== locationRef.current) {
      locationRef.current = location.pathname;
      if (isModalOpen) {
        console.log('Route changed, closing modal');
        dispatch(closeModal());
      }
    }
  }, [location.pathname, dispatch, isModalOpen]);

  const handleOpenModal = useCallback((tab = 'Add Question', props = {}) => {
    console.log('Dispatching openModal with tab:', tab);
    dispatch(openModal({ tab, props }));
  }, [dispatch]);

  const handleCloseModal = useCallback((options = {}) => {
    console.log('Dispatching closeModal with options:', options);
    dispatch(closeModal(options));
  }, [dispatch]);

  const handleResetModal = useCallback(() => {
    console.log('Resetting modal state');
    dispatch(resetModal());
  }, [dispatch]);

  return {
    isModalOpen,
    openModal: handleOpenModal,
    closeModal: handleCloseModal,
    activeTab,
    modalProps,
    resetModal: handleResetModal
  };
};

export default useModal;
