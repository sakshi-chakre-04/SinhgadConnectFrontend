import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useCallback } from 'react';
import {
  closeModal,
  openModal,
  selectIsModalOpen,
  selectModalProps
} from '../features/modal/modalSlice';

export const useModal = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isModalOpen = useSelector(selectIsModalOpen);
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

  const handleOpenModal = useCallback((props = {}) => {
    dispatch(openModal({ props }));
  }, [dispatch]);

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  return {
    isModalOpen,
    openModal: handleOpenModal,
    closeModal: handleCloseModal,
    modalProps
  };
};

export default useModal;