import { createSlice } from "@reduxjs/toolkit";

const RTCSlice = createSlice({
  name: "RTC",

  initialState: {
    RTCClient:null,
     token: "",
    isLoading:true,
    error:false,
    hasJoinedChannel:false
  },

  reducers: {

    startLoading( state ){
        state.isLoading = true;
     },

hasError(state,action){

  state.error = action.payload;
     state.isLoading = false;


},
fetchRTCToken(state, action) {
    state.token = action.payload.token;
    state.isLoading=false;
},

// fetchRTCClient(state, action) {
//   state.RTCClient = action.payload.RTCClient;
//   state.isLoading=false;
// },



    
  },
});

export const RTCActions = RTCSlice.actions;
export default RTCSlice;
