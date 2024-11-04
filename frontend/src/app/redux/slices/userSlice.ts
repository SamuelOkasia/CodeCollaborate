// redux/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  role: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.userId = action.payload.userId;
      state.role = action.payload.role;
      state.token = action.payload.token;
    },
    logout(state) {
      state.userId = null;
      state.role = null;
      state.token = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
