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
      state.isModalOpen = true;
      state.activeTab = tab;
      state.modalProps = props;
    },
    
    closeModal: (state) => {
      state.isModalOpen = false;
      state.activeTab = 'Add Question';
      state.modalProps = {};
    },
    
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    }
  }
});

export const { openModal, closeModal, setActiveTab } = modalSlice.actions;

// Selectors
export const selectIsModalOpen = (state) => state.modal.isModalOpen;
export const selectActiveTab = (state) => state.modal.activeTab;
export const selectModalProps = (state) => state.modal.modalProps;

export default modalSlice.reducer;
