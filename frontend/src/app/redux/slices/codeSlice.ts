// redux/slices/codeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  code: '',
  submissions: [],  // Store a list of code submissions
};

const codeSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    setCode(state, action) {
      state.code = action.payload;
    },
    addSubmission(state, action) {
      state.submissions.push(action.payload);
    },
    updateSubmission(state, action) {
      const index = state.submissions.findIndex(sub => sub.id === action.payload.id);
      if (index !== -1) {
        state.submissions[index] = action.payload;
      }
    },
  },
});

export const { setCode, addSubmission, updateSubmission } = codeSlice.actions;
export default codeSlice.reducer;
