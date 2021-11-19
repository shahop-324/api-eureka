import { createSlice } from "@reduxjs/toolkit";

const boothSlice = createSlice({
  name: "Booth",

  initialState: {
    booths: [],
    videos: [],
    products: [],
    files: [],
    link: [],
    offers: [],
    forms: [],
    businessCards: [],
    uploadBannerPercent: 0,
    uploadPromoImagePercent: 0,
    uploadVideoPercent: 0,
    uploadFilePercent: 0,
    boothDetails: null,
    currentBoothId: null,
    isLoading: true,
    isLoadingDetail: true,
    error: false,
    detailError: false,
  },

  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    startLoadingDetail(state) {
      state.isLoadingDetail = true;
    },

    hasError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    detailHasError(state, action) {
      state.detailError = action.payload;
      state.isLoadingDetail = false;
    },
    disabledError(state, action) {
      state.error = false;
      state.isLoading = false;
    },
    disabledDetailError(state, action) {
      state.detailError = false;
      state.isLoadingDetail = false;
    },
    CreateBooth(state, action) {
      state.booths.push(action.payload.booth);
      state.boothDetails = action.payload.booth;
      state.isLoading = false;
    },

    FetchBooths(state, action) {
      state.booths = action.payload.booths;
      state.isLoading = false;
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
      state.isLoadingDetail = false;
    },

    EditBooth(state, action) {
      state.booths = state.booths.map((booth) =>
        booth._id === action.payload.booth._id ? action.payload.booth : booth
      );
      state.boothDetails = action.payload.booth;
      state.isLoadingDetail = false;
    },
    DeleteBooth(state, action) {
      state.booths = state.booths.filter(
        (booth) => booth._id !== action.payload.id
      );
      state.isLoading = false;
    },
    SetCurrentBoothId(state, action) {
      state.currentBoothId = action.payload.boothId;
      state.isLoading = false;
    },
    SetPromoImageUploadPercent(state, action) {
      state.uploadPromoImagePercent = action.payload.percent;
    },
    SetBoothPosterUploadPercent(state, action) {
      state.uploadBannerPercent = action.payload.percent;
    },
  },
});
export const boothActions = boothSlice.actions;
export default boothSlice;
