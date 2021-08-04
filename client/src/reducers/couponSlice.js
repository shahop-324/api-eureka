import { createSlice } from "@reduxjs/toolkit";

const couponSlice = createSlice({
  name: "Coupon",

  initialState: {
    coupons: [],
    couponDetails: null,
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
    CreateCoupon(state, action) {
      state.coupons.push(action.payload.coupon);
    },
    FetchCoupons(state, action) {
      state.coupons = action.payload.coupons;
      state.isLoading=false
    },
    FetchCoupon(state, action) {
      const newCoupon = action.payload.coupon;
      const existingCoupon = state.coupons.find(
        (coupon) => coupon.id === newCoupon._id
      );

      if (!existingCoupon) {
        state.coupons.push(action.payload.coupon);
      }

      state.couponDetails = action.payload.coupon;
    },

    EditCoupon(state, action) {
      state.coupons = state.coupons.map((coupon) =>
        coupon.id === action.payload.coupon._id ? action.payload.coupon : coupon
      );
    },
    DeleteCoupon(state, action) {
      state.coupons = state.coupons.filter(
        (coupon) => coupon.id !== action.payload.id
      );
    },

    // addSessionOfParticularCoupon(state,action){

    //   state.allSessionsOfParticularCoupon=action.payload.allSessions;

    // },

    // addSpeakerOfParticularCoupon(state,action){

    //   state.allSpeakersOfParticularCoupon=action.payload.speakers

    // }
  },
});
export const couponActions = couponSlice.actions;
export default couponSlice;
