// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import codeReducer from './slices/codeSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    code: codeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
