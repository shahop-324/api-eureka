import { createSlice } from "@reduxjs/toolkit";

const sessionSlice = createSlice({
  name: "Session",

  initialState: {
    sessions: [],
    sessionDetails: null,
    sessionsStatus: [],
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
    FetchSessionsStatus(state, action) {
      state.sessionsStatus = action.payload.sessionsStatus;
    },
    CreateSession(state, action) {
      state.sessions.push(action.payload.session);
    },
    FetchSessions(state, action) {
      state.sessions = action.payload.sessions;
      state.isLoading = false;

    },
    FetchSession(state, action) {
      const newSession = action.payload.session;
      const existingSession = state.sessions.find(
        (session) => session.id === newSession.id
      );

      if (!existingSession) {
        state.sessions.push(action.payload.session);
      }
      state.sessionDetails = action.payload.session;
    },

    EditSession(state, action) {
      console.log(state);
      console.log(action.payload.session);
      const sessionsArr = state.sessions.map((session) =>
        session.id === action.payload.session.id
          ? action.payload.session
          : session
      );
      console.log(sessionsArr);
      state.sessions = sessionsArr;
    },
    
    DeleteSession(state, action) {
      state.sessions = state.sessions.filter(
        (session) => session.id !== action.payload.id
      );
    },

    // addSessionOfParticularSession(state,action){

    //   state.allSessionsOfParticularSession=action.payload.allSessions;

    // },

    // addSpeakerOfParticularSession(state,action){

    //   state.allSpeakersOfParticularSession=action.payload.speakers

    // }
  },
});
export const sessionActions = sessionSlice.actions;
export default sessionSlice;
