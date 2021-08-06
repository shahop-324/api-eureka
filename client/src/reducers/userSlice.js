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
    isLoading:true,
    error:false,


  },

  reducers: {

    ResetError(state, action) {
      state.error = false;
    },

    startLoading( state ){
      state.isLoading = true;
   },

hasError(state,action){

   state.error = action.payload;
   state.isLoading = false;
},
    
    FetchPeopleInSession(state, action) {
      state.peopleInThisSession = action.payload.peopleInThisSession;
    },
    FetchPeopleInEvent(state, action) {
      state.peopleInThisEvent = action.payload.peopleInThisEvent;
    },
    CreateUser(state, action) {
      state.userDetails = action.payload.user;
      state.isLoading = false;
    },
    EditCurrentlyJoinedChair(state, action) {
      state.currentlyJoinedChair = action.payload.chairId;
    },

    FetchUsers(state, action) {
      state.users = action.payload.users;
      state.isLoading = false;
    },

    FetchUser(state, action) {
      state.users.push(action.payload.user);
    },

    DeleteUser(state, action) {
      state.users = state.users.filter(
        (user) => user.id !== action.payload.user.id
      );
    },

    // EditUser(state,action)
    // {

    //      state.users=state.users.map((user)=>user.id===action.payload.user.id?action.payload.user:user)

    // },
  },
});
export const userActions = userSlice.actions;
export default userSlice;
