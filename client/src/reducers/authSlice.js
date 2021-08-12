import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    isSignedIn: false,
    token: "",
    error: false,
    isSignedInThroughGoogle: false,
  },

  reducers: {
    ResetError(state, action) {
      state.error = false;
      // state.isSignedIn = false;
    },
    hasError(state, action) {
      state.error = action.payload;
    },

    disabledError(state, action) {
      state.error = false;
      state.isSignedIn = false;
    },
    SignIn(state, action) {
      state.token = action.payload.token;
      state.isSignedIn = true;

      if (action.payload.isSignedThroughGoogle) {
        state.isSignedInThroughGoogle = action.payload.isSignedThroughGoogle;
      }
    },
    SignOut(state, action) {
      state.token = null;
      state.isSignedIn = false;
      state.isSignedInThroughGoogle = false;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
