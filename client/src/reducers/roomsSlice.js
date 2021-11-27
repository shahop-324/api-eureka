import { createSlice } from "@reduxjs/toolkit";

const roomsSlice = createSlice({
  name: "rooms",

  initialState: {
    chairs: [],
    tableChats: [],
    people: [],
    numberOfPeopleOnTable: 0,
    hasChangedChairs: false,
  },

  reducers: {
    HasChanged(state) {
      state.hasChangedChairs = false;
    },
    FetchRoomsChairs(state, action) {
      state.chairs = action.payload.chairs;
      state.hasChangedChairs = true;
    },
    FetchNumOfPeopleOnTable(state, action) {
      state.numberOfPeopleOnTable = action.payload.numberOfPeopleOnTable;
    },
    FetchTableChats(state, action) {
      state.tableChats = action.payload.chats;
    },
    UpdateMsg(state, action) {
      state.tableChats = state.tableChats.map((chat) =>
        chat._id === action.payload.msg._id ? action.payload.msg : chat
      );
    },
    FetchPeople(state, action) {
      state.people = action.payload.people;
    }
  },
});
export const roomsActions = roomsSlice.actions;
export default roomsSlice;
