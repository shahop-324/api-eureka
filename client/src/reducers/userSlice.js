import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "User",

  initialState: {
    userDetails: null,
    users: [],
    peopleInThisSession: [],
    peopleInThisEvent: [],
    peopleInNetworking: [],
    currentlyJoinedChair: null,
    isLoading: true,
    error: false,
    referredId: null,
    succeded: false,
  },

  reducers: {
    ResetError(state, action) {
      state.error = false;
      state.isLoading = false;
    },
    FetchReferralCode(state, action) {
      state.referredId = action.payload.referredId;
    },
    startLoading(state) {
      state.isLoading = true;
      state.isLoading = false;
    },

    hasError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    disabledError(state, action) {
      state.error = false;
      state.isLoading = false;
    },

    disableSucceded(state, action) {
      state.succeded = false;
    },
    FetchPeopleInSession(state, action) {
      state.peopleInThisSession = action.payload.peopleInThisSession;
      state.isLoading = false;
    },
    FetchPeopleInEvent(state, action) {
      state.peopleInThisEvent = action.payload.peopleInThisEvent;
      state.isLoading = false;
    },
    CreateUser(state, action) {
      state.userDetails = action.payload.user;
      state.isLoading = false;
    },
    EditCurrentlyJoinedChair(state, action) {
      state.currentlyJoinedChair = action.payload.chairId;
      state.isLoading = false;
    },

    FetchUsers(state, action) {
      state.users = action.payload.users;
      state.isLoading = false;
    },

    FetchUser(state, action) {
      state.users.push(action.payload.user);
      state.isLoading = false;
    },

    DeleteUser(state, action) {
      state.users = state.users.filter(
        (user) => user.id !== action.payload.user.id
      );
      state.isLoading = false;
    },

    EditUser(state, action) {
      state.users = state.users.map((user) =>
        user.id === action.payload.user.id ? action.payload.user : user
      );

      state.userDetails = action.payload.user;
      state.isLoading = false;
      state.succeded = true;
    },
  },
});
export const userActions = userSlice.actions;
export default userSlice;
