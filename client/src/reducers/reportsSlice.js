import { createSlice } from "@reduxjs/toolkit";

const reportsSlice = createSlice({
  name: "reports",

  initialState: {
    reports: [],
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
    FetchReports(state, action) {
      state.reports = action.payload.reports;
      state.isLoading = false;
    },
    UpdateReport(state, action) {
      // If already inside then just update else push it in

      state.reports = state.reports.filter(
        (el) => el._id.toString() !== action.payload.report._id.toString()
      );

      state.reports.push(action.payload.report);
    },
  },
});
export const reportsActions = reportsSlice.actions;
export default reportsSlice;
