import { createSlice } from "@reduxjs/toolkit";


const boothSlice = createSlice({
  name: "Booth",

  initialState:{
     
     
     booths:[],
     boothDetails: null,
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

    CreateBooth(state,action){
       state.booths.push(action.payload.booth);
    },

    FetchBooths(state, action) {
     
      state.booths=action.payload.booths;
      state.isLoading=false

       
    },
    FetchBooth(state, action) {
     
      const newBooth = action.payload.booth;
      const existingBooth = state.booths.find(
        (booth) => booth._id === newBooth._id
      );

      if (!existingBooth) {
        state.booths.push(action.payload.booth);
      }
      
      state.boothDetails = action.payload.booth;
    },

    EditBooth(state,action)
    {

         state.booths=state.booths.map((booth)=>booth._id===action.payload.booth._id?action.payload.booth:booth)

    },
    DeleteBooth(state,action)
    {
      state.booths=state.booths.filter((booth)=>booth._id!==action.payload.id);
    }



    
   

    // addSessionOfParticularBooth(state,action){
     
    
    //   state.allSessionsOfParticularBooth=action.payload.allSessions;
     
    

    // },

    // addSpeakerOfParticularBooth(state,action){
       
 
    //   state.allSpeakersOfParticularBooth=action.payload.speakers
 
      


    // }
      

  },
});
export const boothActions = boothSlice.actions;
export default boothSlice;
