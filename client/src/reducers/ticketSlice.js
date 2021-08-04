import { createSlice } from "@reduxjs/toolkit";

const ticketSlice = createSlice({
  name: "Ticket",

  initialState: {
    tickets: [],
    ticketDetails: null,
    isLoading:true,
    error:false,
  },

  reducers: {
    startLoading( state ){
      state.isLoading = true;
   },

hasError(state,action){

state.error = action.payload;
   state.isLoading = false;


},
    CreateTicket(state, action) {
      state.tickets.push(action.payload.ticket);

    },
    FetchTickets(state, action) {
      state.tickets = action.payload.tickets;
      state.isLoading = false;


    },
    FetchTicket(state, action) {
      const newTicket = action.payload.ticket;
      const existingTicket = state.tickets.find(
        (ticket) => ticket.id === newTicket.id
      );

      if (!existingTicket) {
        state.tickets.push(action.payload.ticket);
      }

      state.ticketDetails = action.payload.ticket;
    },

    EditTicket(state, action) {
      state.tickets = state.tickets.map((ticket) =>
        ticket.id === action.payload.ticket.id ? action.payload.ticket : ticket
      );
    },
    DeleteTicket(state, action) {
      state.tickets = state.tickets.filter(
        (ticket) => ticket.id !== action.payload.id
      );
    },

    // addSessionOfParticularTicket(state,action){

    //   state.allSessionsOfParticularTicket=action.payload.allSessions;

    // },

    // addSpeakerOfParticularTicket(state,action){

    //   state.allSpeakersOfParticularTicket=action.payload.speakers

    // }
  },
});
export const ticketActions = ticketSlice.actions;
export default ticketSlice;
