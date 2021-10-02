import { createSlice } from "@reduxjs/toolkit";

const communitySlice = createSlice({
  name: "Community",

  initialState: {
    communities: [],
    communityDetails: null,
    isCommunityLoading: false,
    error: false,
    isLoading: true,
    mailChimpAudiences: [],
    invitations: [],
    communityManagers: [],
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

    FetchInvitations(state, action) {
      state.invitations = action.payload.invitations;
    },

    FetchCommunityManagers(state, action) {
      state.communityManagers = action.payload.communityManagers;
    },

    SendTeamInvitation(state, action) {
      state.invitations.push(action.payload.invitation);
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
    FetchMailChimpAudiences(state, action) {
      state.mailChimpAudiences = action.payload.mailChimpAudiences;
      state.isLoading = false;
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
    RemoveCommunityManager(state, action) {
      if (action.payload.status === "Pending") {
        state.invitations = state.invitations.filter(
          (el) => el.invitedUserEmail !== action.payload.email
        );
      }
      if (action.payload.status === "Accepted") {
        state.communityManagers = state.communityManagers.filter(
          (el) => el.email !== action.payload.email
        );
      }
    },
  },
});
export const communityActions = communitySlice.actions;
export default communitySlice;
