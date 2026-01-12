import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isModalOpen: false,
  modalProps: {}
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      const { props = {} } = action.payload || {};
      state.isModalOpen = true;
      state.modalProps = props;
    },

    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalProps = {};
    }
  }
});

export const { openModal, closeModal } = modalSlice.actions;

// Selectors
export const selectIsModalOpen = (state) => state.modal.isModalOpen;
export const selectModalProps = (state) => state.modal.modalProps;

export default modalSlice.reducer;
