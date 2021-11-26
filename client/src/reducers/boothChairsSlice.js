import { createSlice } from "@reduxjs/toolkit";

const boothChairsSlice = createSlice({
  name: "boothChairs",

  initialState: {
    chairs: [],
    tableChats: [],
    numberOfPeopleOnTable: 0,
    hasChangedChairs: false,
  },

  reducers: {
    HasChanged(state) {
      state.hasChangedChairs = false;
    },
    FetchBoothRoomsChairs(state, action) {
      state.chairs = action.payload.chairs;
      state.hasChangedChairs = true;
    },
    FetchBoothNumOfPeopleOnTable(state, action) {
      state.numberOfPeopleOnTable = action.payload.numberOfPeopleOnTable;
    },
    FetchBoothTableChats(state, action) {
      state.tableChats = action.payload.tableChats;
    },
    UpdateMsg(state, action) {
      state.tableChats = state.tableChats.map((chat) =>
        chat._id === action.payload.msg._id ? action.payload.msg : chat
      );
    },
  },
});
export const boothChairsActions = boothChairsSlice.actions;
export default boothChairsSlice;
