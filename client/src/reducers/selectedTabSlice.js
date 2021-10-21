import { createSlice } from "@reduxjs/toolkit";

const SelectedTabSlice = createSlice({
  name: "SelectedTab",

  initialState: {
    venueRightDrawerSelectedTab: null, // Can be feed || people || alerts || polls || moderation
    openVenueRightDrawer: false, // can be true or false
    chatSelectedTab: "all", // Can be all || private
  },

  reducers: {
    setVenueRightDrawerSelectedTab(state, action) {
      state.venueRightDrawerSelectedTab = action.payload.tab;
    },
    setChatSelectedTab(state, action) {
      state.chatSelectedTab = action.payload.tab;
    },
    setOpenVenueRightDrawer(state, action) {
      state.openVenueRightDrawer = action.payload.openState;
    },
  },
});

export const SelectedTabActions = SelectedTabSlice.actions;
export default SelectedTabSlice;
