import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import modalReducer from '../features/modal/modalSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
