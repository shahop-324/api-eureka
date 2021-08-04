import { createSlice } from "@reduxjs/toolkit";

const googleAuthSlice = createSlice({
  name: "GoogleAuth",

  initialState: {
   
    googleId:"",
    isClicked:false,
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

    TrackerGoogleLogin(state,action){

      state.isClicked = action.payload.isClicked;
      
    },
    SignIn(state, action) {
     
     
     
     
    
     
      state.googleId=action.payload.googleId;

    },
    SignOut(state,action)
    {
        
      state.googleId="";
    }
  },
});

export const googleAuthActions = googleAuthSlice.actions;
export default googleAuthSlice;
