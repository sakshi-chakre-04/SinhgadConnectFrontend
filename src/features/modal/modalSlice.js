import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isModalOpen: false,
  activeTab: 'Add Question',
  modalProps: {}
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      const { tab = 'Add Question', props = {} } = action.payload || {};
      console.log('Opening modal with tab:', tab);
      state.isModalOpen = true;
      state.activeTab = tab;
      state.modalProps = props;
      
      // Store the current path to restore after login if needed
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        sessionStorage.setItem('lastPathBeforeModal', window.location.pathname);
      }
    },
    closeModal: (state, action) => {
      const shouldRefresh = action.payload?.shouldRefresh || false;
      console.log('Closing modal, shouldRefresh:', shouldRefresh);
      state.isModalOpen = false;
      if (!shouldRefresh) {
        state.modalProps = {};
        state.activeTab = 'Add Question'; // Reset to default tab when closing
      }
    },
    setActiveTab: (state, action) => {
      console.log('Setting active tab to:', action.payload);
      state.activeTab = action.payload;
    },
    resetModal: (state) => {
      console.log('Resetting modal state');
      return { ...initialState };
    }
  }
});

export const { openModal, closeModal, setActiveTab, resetModal } = modalSlice.actions;

export const selectIsModalOpen = (state) => state.modal.isModalOpen;
export const selectActiveTab = (state) => state.modal.activeTab;
export const selectModalProps = (state) => state.modal.modalProps;

export default modalSlice.reducer;
