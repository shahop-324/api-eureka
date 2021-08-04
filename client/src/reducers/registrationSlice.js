import { createSlice } from "@reduxjs/toolkit";

const registrationSlice = createSlice({
  name: "registration",

  initialState: {
    registrations: [],
    registrationDetails: null,

    isLoading:true,
      error:false,
  },

  reducers: {
    // CreateSession(state, action) {
    //   state.registrations.push(action.payload.registration);
    // },

    startLoading( state ){
      state.isLoading = true;
   },

hasError(state,action){

state.error = action.payload;
   state.isLoading = false;


},
    FetchRegistrations(state, action) {
      state.registrations = action.payload.registrations;
      state.isLoading = false;
    },
    FetchRegistration(state, action) {
      const newRegistration = action.payload.registration;
      const existingRegistration = state.registrations.find(
        (registration) => registration.id === newRegistration.id
      );

      if (!existingRegistration) {
        state.registrations.push(action.payload.registration);
      }
      state.registrationDetails = action.payload.registration;
    },

    // EditSession(state, action) {
    //   console.log(state);
    //   console.log(action.payload.registration);
    //   const sessionsArr = state.registrations.map((registration) =>
    //     registration.id === action.payload.registration.id
    //       ? action.payload.registration
    //       : registration
    //   );
    //   console.log(sessionsArr);
    //   state.registrations = sessionsArr;
    // },
    // DeleteSession(state, action) {
    //   state.registrations = state.registrations.filter(
    //     (registration) => registration.id !== action.payload.id
    //   );
    // },

    // addSessionOfParticularSession(state,action){

    //   state.allSessionsOfParticularSession=action.payload.allSessions;

    // },

    // addSpeakerOfParticularSession(state,action){

    //   state.allSpeakersOfParticularSession=action.payload.speakers

    // }
  },
});
export const registrationActions = registrationSlice.actions;
export default registrationSlice;
