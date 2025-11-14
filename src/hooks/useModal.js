import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useCallback } from 'react';
import { 
  closeModal, 
  openModal, 
  selectActiveTab, 
  selectIsModalOpen, 
  selectModalProps 
} from '../features/modal/modalSlice';

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
        dispatch(closeModal());
      }
    }
  }, [location.pathname, dispatch, isModalOpen]);

  const handleOpenModal = useCallback((tab = 'Add Question', props = {}) => {
    dispatch(openModal({ tab, props }));
  }, [dispatch]);

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  return {
    isModalOpen,
    openModal: handleOpenModal,
    closeModal: handleCloseModal,
    activeTab,
    modalProps
  };
};

export default useModal;
// 🔹 useEffect is used when you want to react to something that happened after rendering —
// like fetching data, updating the DOM, or syncing with external systems.
// (You let React handle when it runs — after render.)

// 🔹 useCallback is used when you want to control and reuse a function yourself,
// especially to prevent it from being recreated on every render.
// (You decide when to call it — React just keeps its reference stable.)