import { createSlice } from "@reduxjs/toolkit";

const communitySlice = createSlice({
  name: "Community",

  initialState: {
    communities: [],
    communityDetails: null,
    isCommunityLoading: false,
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

      state.isCommunityLoading = false;
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
