import { createSlice } from "@reduxjs/toolkit";


const speakerSlice = createSlice({
  name: "Speaker",

  initialState:{
     
     
     speakers:[],
     speakerDetails: null,
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
    CreateSpeaker(state,action){
       state.speakers.push(action.payload.speaker);


    },
    FetchSpeakers(state, action) {
     
      state.speakers=action.payload.speakers;
      state.isLoading = false;

       
    },
    FetchSpeaker(state, action) {
     
      const newSpeaker = action.payload.speaker;
      const existingSpeaker = state.speakers.find(
        (speaker) => speaker.id === newSpeaker.id
      );

      if (!existingSpeaker) {
        state.speakers.push(action.payload.speaker);


        
      }
      state.speakerDetails = action.payload.speaker;
       
        
    },

    EditSpeaker(state,action)
    {

         state.speakers=state.speakers.map((speaker)=>speaker.id===action.payload.speaker.id?action.payload.speaker:speaker)



    },
    DeleteSpeaker(state,action)
    {
      state.speakers=state.speakers.filter((speaker)=>speaker.id!==action.payload.id);
    }



    
   

    // addSessionOfParticularSpeaker(state,action){
     
    
    //   state.allSessionsOfParticularSpeaker=action.payload.allSessions;
     
    

    // },

    // addSpeakerOfParticularSpeaker(state,action){
       
 
    //   state.allSpeakersOfParticularSpeaker=action.payload.speakers
 
      


    // }
      

  },
});
export const speakerActions = speakerSlice.actions;
export default speakerSlice;
