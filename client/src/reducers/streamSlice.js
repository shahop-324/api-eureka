import { createSlice } from "@reduxjs/toolkit";

const StreamSlice = createSlice({
  name: "Streams",

  initialState: {
    remoteStreams: [],
    allStreams: [],
    localStream: null,
  },

  reducers: {
    fetchRemoteStreams(state, action) {
      state.remoteStreams = action.payload.streams;
    },
    fetchLocalStream(state, action) {
      state.localStream = action.payload.localStream;
    },
  },
});

export const StreamActions = StreamSlice.actions;
export default StreamSlice;
