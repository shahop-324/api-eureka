import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    isSignedIn: false,
    token: "",
    
    error:false
  },

  reducers: {

   

    
    ResetError(state,action){
  
     state.error = false;
     
  },
    hasError(state,action){
  
     state.error = action.payload;
     
  },
    SignIn(state, action) {
      state.token = action.payload.token;
      state.isSignedIn = action.payload.isSignedIn;
      
     
   
    },
    SignOut(state, action) {

      (async() => {
       await window.localStorage.clear();
      })();
      state.token = null;
      state.isSignedIn = false;
       
      

    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
