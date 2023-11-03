import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux/slices/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
