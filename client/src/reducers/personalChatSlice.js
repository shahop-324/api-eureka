import { createSlice } from "@reduxjs/toolkit";

const personalChatSlice = createSlice({
  name: "Personal Chat",

  initialState: {
    id: null, // Object Id of Platform User || Speaker || Exhibitor
    chats: [], // Array of all chats => All personal chats related to this user
  },

  reducers: {
    EditPersonalChat(state, action) {
      state.id = action.payload.id;
    },
    UpdateChats(state, action) {
      // update chat when this user sends a message or recieves one
      state.chats.push(action.payload.chat);
    },
    FetchChats(state, action) {
      // Fetch all chats in which this user is sender or reciever
      state.chats = action.payload.chats;
    },
    UpdateMsg(state, action) {
      state.chats = state.chats.map((chat) =>
        chat._id === action.payload.msg._id ? action.payload.msg : chat
      );
    },
  },
});
export const personalChatActions = personalChatSlice.actions;
export default personalChatSlice;
