import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    isSignedIn: false,
    token: "",
    error: false,
    isSignedInThroughGoogle: false,
    referralCode: null,
    accessToken: null,
    isLoading: false,
  },

  reducers: {
    startLoading(state, action) {
      state.isLoading = true;
    },
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
      state.referralCode = action.payload.referralCode;
      if (action.payload.isSignedThroughGoogle) {
        state.isSignedInThroughGoogle = action.payload.isSignedThroughGoogle;
      }
    },
    LinkedInAccessToken(state, action) {
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
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
