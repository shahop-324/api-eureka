import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    isSignedIn: false,
    token: "",
    
    error:false
  },

  reducers: {

   

  hasError(state,action){

   state.error = action.payload;
   
},

    SignIn(state, action) {
      state.token = action.payload.token;
      state.isSignedIn = action.payload.isSignedIn;
      
     
   
    },
    SignOut(state, action) {

      
      state.token = null;
      state.isSignedIn = false;
       window.localStorage.clear();
      

    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
