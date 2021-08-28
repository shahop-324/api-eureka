import { createSlice } from "@reduxjs/toolkit";

const eventPollSlice = createSlice({
  name: "EventPoll",

  initialState: {
    eventPolls: [],
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
    FetchEventPolls(state, action) {
      if (!action.payload.eventPolls) {
        state.isLoading = false;
        return;
      }
      state.eventPolls = action.payload.eventPolls;
      state.isLoading = false;
    },
    CreateEventPoll(state, action) {
      state.eventPolls.push(action.payload.eventPoll);
      state.isLoading = false;
    },
    UpdateEventPoll(state, action) {
      console.log(action.payload.updatedPoll);

      const pollsArr = state.eventPolls.map((poll) =>
        poll.id === action.payload.updatedPoll
          ? action.payload.updatedPoll
          : poll
      );

      console.log(pollsArr);
      state.eventPolls = pollsArr;
      state.isLoading = false;
    },

    // EditSession(state, action) {
    //     console.log(state);
    //     console.log(action.payload.session);
    //     const sessionsArr = state.sessions.map((session) =>
    //       session.id === action.payload.session.id
    //         ? action.payload.session
    //         : session
    //     );
    //     console.log(sessionsArr);
    //     state.sessions = sessionsArr;
    //     state.sessionDetails = action.payload.session;
    //     state.isLoadingDetail = false;
    //   },
  },
});
export const eventPollActions = eventPollSlice.actions;
export default eventPollSlice;
