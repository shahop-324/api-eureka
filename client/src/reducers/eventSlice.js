import { createSlice } from "@reduxjs/toolkit";

const eventSlice = createSlice({
  name: "Event",

  initialState: {
    events: [],
    favouriteEvents: [],
    eventDetails: null,
    entryRestriction: null,
    permittedTickets: [],
    permittedPeople: [],
    isLoading: true,
    error: false,
    length: 0,
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

    CreateEvent(state, action) {
      state.events.unshift(action.payload.event);
      state.isLoading = false;
    },
    FetchEvents(state, action) {
      console.log(action.payload.events, "oppppoppoppopp");
      state.events = action.payload.events;
      state.length = action.payload.length;
      state.isLoading = false;
    },
    FetchFavouriteEvents(state, action) {
      state.favouriteEvents = action.payload.events;
      state.length = action.payload.length;
      state.isLoading = false;
      state.error = false;
    },
    AddToFavouriteEvents(state, action) {
      const newFavouriteEvent = action.payload.event;

      state.favouriteEvents.push(newFavouriteEvent);
      state.isLoading = false;
      state.error = false;
    },
    RemoveFromFavouriteEvents(state, action) {
      state.favouriteEvents = state.favouriteEvents.filter(
        (event) => event.id !== action.payload.event.id
      );
      state.isLoading = false;
      state.error = false;
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

      const id =
        action.payload.event && action.payload.event._id
          ? action.payload.event._id
          : action.payload.event.id;

      state.events = state.events.map((event) =>
        event.id === id ? action.payload.event : event
      );
      state.eventDetails = action.payload.event;
      state.isLoading = false;
    },
    DeleteEvent(state, action) {
      state.events = state.events.filter(
        (event) => event.id !== action.payload.event.id
      );
      state.isLoading = false;
    },
  },
});
export const eventActions = eventSlice.actions;
export default eventSlice;
