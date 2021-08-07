import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    isSignedIn: false,
    token: "",
    error: false,
  },

  reducers: {
    ResetError(state, action) {
      state.error = false;
    },
    hasError(state, action) {
      state.error = action.payload;
    },

    disabledError(state, action) {
      state.error = false;
      state.isLoading = false;
    },
    SignIn(state, action) {
      state.token = action.payload.token;
      state.isSignedIn = action.payload.isSignedIn;
      state.isLoading = false;
    },
    SignOut(state, action) {
      state.token = null;
      state.isSignedIn = false;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
