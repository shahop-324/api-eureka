import { createSlice } from "@reduxjs/toolkit";

const demoSlice = createSlice({
  name: "Demo",

  initialState: {
    demo: null,
    isLoading: true,
    error: false,
  },

  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    disabledError(state, action) {
      state.error = false;
      state.isLoading = false;
    },
    CreateDemo(state, action) {
      state.demo=action.payload.demo;
      state.isLoading = false;
    },
  },
});
export const demoActions = demoSlice.actions;
export default demoSlice;
