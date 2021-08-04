import { createSlice } from "@reduxjs/toolkit";

const roomsSlice = createSlice({
  name: "rooms",

  initialState: {
    chairs: [],
    numberOfPeopleOnTable: 0,
    hasChangedChairs:false
  },

  reducers: {
    HasChanged(state){
      state.hasChangedChairs=false
      
    },
    FetchRoomsChairs(state, action) {
      state.chairs = action.payload.chairs;
      state.hasChangedChairs=true
      
    },
    FetchNumOfPeopleOnTable(state, action) {
      state.numberOfPeopleOnTable = action.payload.numberOfPeopleOnTable;

    },
  },
});
export const roomsActions = roomsSlice.actions;
export default roomsSlice;
