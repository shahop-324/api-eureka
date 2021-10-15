import { createSlice } from "@reduxjs/toolkit";

const personalChatSlice = createSlice({
  name: "Personal Chat",

  initialState: {
    id: null, // Object Id of Platform User || Speaker || Exhibitor
  },

  reducers: {
    EditPersonalChat(state, action) {
      state.id = action.payload.id;
    }, 
  },
});
export const personalChatActions = personalChatSlice.actions;
export default personalChatSlice;
