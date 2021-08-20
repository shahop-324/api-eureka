import { createSlice } from "@reduxjs/toolkit";

const communitySlice = createSlice({
  name: "Community",

  initialState: {
    communities: [],
    communityDetails: null,
<<<<<<< HEAD
    isCommunityLoading: false,
=======
    isCommunityLoading: true,
>>>>>>> 7cd980f765d31802588e85543798f0a3fe656872
    error: false,
    isLoading: true,
  },
  reducers: {
    ResetError(state, action) {
      state.error = false;
      state.isLoading = false;
    },
    startLoading(state) {
      state.isLoading = true;
    },
    startCommunityLoading(state) {
      state.isCommunityLoading = true;
    },

    hasError(state, action) {
      state.error = action.payload;
    },
    disabledError(state, action) {
      state.error = false;
      state.isLoading = false;
    },

    CreateCommunity(state, action) {
      state.communities.push(action.payload.community);
      state.communityDetails = action.payload.community;
      state.isLoading = false;
    },

    FetchCommunities(state, action) {
      state.communities = action.payload.communities;
      state.isLoading = false;
<<<<<<< HEAD

      state.isCommunityLoading = false;
=======
      state.isCommunityLoading=false;
>>>>>>> 7cd980f765d31802588e85543798f0a3fe656872
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
      state.isLoading = false;
    },

    EditCommunity(state, action) {
      state.community = action.payload.community;
      state.isLoading = false;
    },
    DeleteCommunity(state, action) {
      state.community = null;
      state.isLoading = false;
    },
  },
});
export const communityActions = communitySlice.actions;
export default communitySlice;
