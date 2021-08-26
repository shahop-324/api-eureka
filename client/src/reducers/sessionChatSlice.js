import { createSlice } from "@reduxjs/toolkit";

const sessionChatSlice = createSlice({
  name: "SessionChat",

  initialState: {
    sessionChats: [],
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
    FetchSessionChats(state, action) {
      state.sessionChats = action.payload.sessionChats;
      state.isLoading = false;
    },
    CreateSessionChat(state, action) {
      state.sessionChats.push(action.payload.chat);
      state.isLoading = false;
    }
  },
});
export const sessionChatActions = sessionChatSlice.actions;
export default sessionChatSlice;
