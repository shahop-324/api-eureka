import { createSlice } from "@reduxjs/toolkit";

const sponsorSlice = createSlice({
  name: "Sponsor",

  initialState: {
    sponsors: [],
    sponsorDetails: null,
    isLoading: true,
    error: false,
  },

  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },

    disabledError(state, action) {
      state.error = false;
      state.isLoading = false;
    },
    CreateSponsor(state, action) {
      state.sponsors.push(action.payload.sponsor);

      state.sponsorDetails = action.payload.sponsor;

      state.isLoading = false;
    },
    FetchSponsors(state, action) {
      state.sponsors = action.payload.sponsors;
      state.isLoading = false;
    },
    FetchSponsor(state, action) {
      const newSponsor = action.payload.sponsor;
      const existingSponsor = state.sponsors.find(
        (sponsor) => sponsor._id === newSponsor._id
      );

      if (!existingSponsor) {
        state.sponsors.push(action.payload.sponsor);
      }

      state.sponsorDetails = action.payload.sponsor;
      state.isLoading = false;
    },

    EditSponsor(state, action) {
      state.sponsors = state.sponsors.map((sponsor) =>
        sponsor._id === action.payload.sponsor._id
          ? action.payload.sponsor
          : sponsor
      );
      state.sponsorDetails = action.payload.sponsor;
      state.isLoading = false;
    },
    DeleteSponsor(state, action) {
      state.sponsors = state.sponsors.filter(
        (sponsor) => sponsor._id !== action.payload.id
      );
      state.isLoading = false;
    },
  },
});
export const sponsorActions = sponsorSlice.actions;
export default sponsorSlice;
