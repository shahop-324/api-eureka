// import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from "redux";
import authSlice from "./authSlice";
import eventSlice from "./eventSlice";
import navigationSlice from "./navigationSlice";
import { reducer as formReducer } from "redux-form";
import boothSlice from "./boothSlice";
import communitySlice from "./communitySlice";
import sessionSlice from "./sessionSlice";
import speakerSlice from "./speakerSlice";
import sponsorSlice from "./sponsorSlice";
import ticketSlice from "./ticketSlice";
import userSlice from "./userSlice";

import googleAuthSlice from "./googleAuthSlice";
import communityAuthSlice from "./communityAuthSlice";
import networkingSlice from "./networkingSlice";
import couponSlice from "./couponSlice";
import stripeSlice from "./stripeSlice";
import queriesSlice from "./queriesSlice";
import registrationSlice from "./registrationSlice";
import eventAccessSlice from "./eventAccessSlice";
import socketSlice from "./socketSlice";
import stageSlice from "./stageSlice";
import roomsSlice from "./roomsSlice";
import RTMSlice from "./RTMSlice";
import eventChatSlice from "./eventChatSlice";
import RTCSlice from "./RTCSlice";
import demoSlice from "./demoSlice";
import contactUsSlice from "./contactSlice";
import affiliateSlice from "./affiliateSlice";
import interestedPeopleSlice from "./interestedPeopleSlice";
import sessionChatSlice from "./sessionChatSlice";
import eventAlertSlice from "./eventAlertSlice";
import eventPollSlice from "./eventPollSlice";
import AvailableForNetworkingSlice from "./availableForNetworking";
import StreamSlice from "./streamSlice";

export default combineReducers({
  auth: authSlice.reducer,
  form: formReducer,
  event: eventSlice.reducer,
  navigation: navigationSlice.reducer,
  booth: boothSlice.reducer,
  community: communitySlice.reducer,
  session: sessionSlice.reducer,
  speaker: speakerSlice.reducer,
  sponsor: sponsorSlice.reducer,
  ticket: ticketSlice.reducer,
  user: userSlice.reducer,
  googleAuth: googleAuthSlice.reducer,
  networking: networkingSlice.reducer,
  coupon: couponSlice.reducer,
  stripe: stripeSlice.reducer,
  communityAuth: communityAuthSlice.reducer,
  query: queriesSlice.reducer,
  registration: registrationSlice.reducer,
  eventAccessToken: eventAccessSlice.reducer,
  socket: socketSlice.reducer,
  stage: stageSlice.reducer,
  rooms: roomsSlice.reducer,
  RTM: RTMSlice.reducer,
  RTC: RTCSlice.reducer,

  chats: eventChatSlice.reducer,
  sessionChats: sessionChatSlice.reducer,
  demo: demoSlice.reducer,
  contact: contactUsSlice.reducer,
  affiliate: affiliateSlice.reducer,
  interestedPeople: interestedPeopleSlice.reducer,
  eventAlert: eventAlertSlice.reducer,
  eventPoll: eventPollSlice.reducer,
  availableForNetworking: AvailableForNetworkingSlice.reducer,
  streams: StreamSlice.reducer,
});
