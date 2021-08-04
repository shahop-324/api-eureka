import { createSlice } from "@reduxjs/toolkit";



const communitySlice = createSlice({
  name: "Community",

  initialState:{
     
     communities:[],
     communityDetails: null,
     
      error:false,
      isLoading:true
  
  },
  reducers: {
    startLoading( state ){
      state.isLoading = true;
   },

  hasError(state,action){

   state.error = action.payload;
  
   },

  CreateCommunity(state,action){
      state.communities.push(action.payload.community);
     

   },
     
    FetchCommunities(state, action) {
     
      state.communities=action.payload.communities;
      state.isLoading =false
    
       
    },
    FetchCommunity(state, action) {
     
      const newCommunity = action.payload.community;
      const existingCommunity = state.communities.find(
        (community) => community.id === newCommunity.id
      );

      if (!existingCommunity) {
        state.community.push(action.payload.community);


      }
       
      state.communityDetails = action.payload.community;
      state.isLoading=false;
        
    },



    EditCommunity(state,action)
    {

         state.community=action.payload.community

         

    },
    DeleteCommunity(state,action)
    {
      state.community=null
    },

  },
});
export const communityActions = communitySlice.actions;
export default communitySlice;
