import { createSlice } from "@reduxjs/toolkit";

const networkingSlice = createSlice({
  name: "Networking",

  initialState: {
    networkingSettings: null,
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
    FetchNetworking(state, action) {
      state.networkingSettings = action.payload.settings;
      state.isLoading = false;
    },

    EditNetworking(state, action) {
      state.networkingSettings = action.payload.settings;
      state.isLoading = false;
    },
  },
});
export const networkingActions = networkingSlice.actions;
export default networkingSlice;
