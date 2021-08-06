import { createSlice } from "@reduxjs/toolkit";

const eventSlice = createSlice({
  name: "Event",

  initialState: {
    events: [],
    eventDetails: null,

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

    CreateEvent(state, action) {
      state.events.push(action.payload.event);
    },
    FetchEvents(state, action) {
      state.events = action.payload.events;
      state.isLoading = false;
    },
    FetchEvent(state, action) {
      console.log("opoo", 28);

      const newEvent = action.payload.event;
      const existingEvent = state.events.find(
        (event) => event.id === newEvent.id
      );

      if (!existingEvent) {
        state.events.push(action.payload.event);
      }

      state.eventDetails = action.payload.event;
      state.isLoading = false;
    },

    EditEvent(state, action) {
      console.log(action.payload.event);
      state.events = state.events.map((event) =>
        event.id === action.payload.event.id ? action.payload.event : event
      );
      state.eventDetails = action.payload.event;
    },
    DeleteEvent(state, action) {
      state.events = state.events.filter(
        (event) => event.id !== action.payload.event.id
      );
    },
  },
});
export const eventActions = eventSlice.actions;
export default eventSlice;
