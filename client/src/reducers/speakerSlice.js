import { createSlice } from "@reduxjs/toolkit";

const speakerSlice = createSlice({
  name: "Speaker",

  initialState: {
    speakers: [],
    speakerDetails: null,
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
    CreateSpeaker(state, action) {
      state.speakers.push(action.payload.speaker);
      state.isLoading = false;

      state.speakerDetails = action.payload.speaker;
    },
    FetchSpeakers(state, action) {
      state.speakers = action.payload.speakers;
      state.isLoading = false;
    },
    FetchSpeaker(state, action) {
      const newSpeaker = action.payload.speaker;
      const existingSpeaker = state.speakers.find(
        (speaker) => speaker.id === newSpeaker.id
      );

      if (!existingSpeaker) {
        state.speakers.push(action.payload.speaker);
      }
      state.speakerDetails = action.payload.speaker;
      state.isLoading = false;
    },

    EditSpeaker(state, action) {
      state.speakers = state.speakers.map((speaker) =>
        speaker.id === action.payload.speaker.id
          ? action.payload.speaker
          : speaker
      );
      state.isLoading = false;
    },
    DeleteSpeaker(state, action) {
      state.speakers = state.speakers.filter(
        (speaker) => speaker.id !== action.payload.id
      );
      state.isLoading = false;
    },
  },
});
export const speakerActions = speakerSlice.actions;
export default speakerSlice;
