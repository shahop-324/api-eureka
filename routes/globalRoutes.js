const express = require("express");
const globalController = require("../controllers/globalController");
const authController = require("./../controllers/authController");
const chatMessagesController = require("../controllers/chatMessageController");
const eventAlertController = require("../controllers/eventAlertController");
const eventPollController = require("../controllers/eventPollController");
const networkingController = require("./../controllers/networkingController");

const router = express.Router();

router.post("/generateCodes", globalController.generateCodes);

router.get("/getCodes", globalController.getCodes);

router.post(
  "/redeemAppSumoCode",
  authController.protectCommunity,
  globalController.redeemAppSumoCode
);

router.post(
  "/createRTMPDestination/:eventId",
  authController.protectCommunity,
  globalController.createRTMPDestination
);

router.get(
  "/getRTMPDestinations/:eventId",
  authController.protectCommunity,
  globalController.getRTMPDestinations
);

router.get(
  "/getOneStreamDestination/:destinationId",
  authController.protectCommunity,
  globalController.getOneStreamDestination
);

router.patch(
  "/updateStreamDestination/:destinationId",
  authController.protectCommunity,
  globalController.updateStreamDestination
);

router.delete(
  "/deleteStreamDestination/:destinationId",
  authController.protectCommunity,
  globalController.deleteStreamDestination
);

router.get("/mux", globalController.generateMUXCredentials);

router
  .route("/exploreEvents/madeJustForYou")
  .get(globalController.aliasTopEvents, globalController.getAllEvents);

router.get("/exploreEvents", globalController.getAllEvents);

router.get(
  "/getPreviousEventMsg/:eventId",
  chatMessagesController.getPreviousEventChatMessage
);

router.get(
  "/getPreviousSessionMsg/:sessionId",
  chatMessagesController.getPreviousSessionChatMessage
);

router.get(
  "/getPreviousEventAlert/:eventId",
  eventAlertController.getPreviousEventAlert
);

router.get(
  "/getPreviousEventPolls/:eventId",
  eventPollController.getPreviousEventPoll
);

router.post(
  "/generateEventAccessToken",
  globalController.createEventAccessToken
);

router.post(
  "/getRTCVideoCallToken",
  authController.protect,
  globalController.generateTokenForVideoCall
);

router.post(
  "/getLiveStreamingTokenAndSession",
  authController.protect,
  globalController.generateTokenForLiveStreaming
);

router.post(
  "/getLiveStreamingTokenForJoiningTable",
  globalController.generateLiveStreamingTokenForJoiningTable
);

router.post(
  "/getLiveStreamingTokenForNetworking",
  globalController.getLiveStreamingTokenForNetworking
);

router.post(
  "/getLiveStreamingTokenForNonUser",
  globalController.generateTokenForLiveStreamingForNonUser
);

router.post(
  "/getLiveStreamingTokenForScreenShare",
  globalController.generateTokenForLiveStreamingForScreenShare
);

router.post(
  "/getRTMToken",
  authController.protect,
  globalController.generateRTMToken
);

router.post(
  "/getRTMTokenForSpeaker",
  globalController.generateRTMTokenForSpeaker
);

router.get(
  "/availableForNetworking/:eventId",
  networkingController.getAllAvailableForNetworking
);

router.get("/getTawkLink/:communityId", globalController.getTawkLink);

router.get("/getAllEvents", globalController.getAllEvents);

router.get(
  "/getCommunityTransactions/:communityId",
  authController.protectCommunity,
  globalController.getCommunityTransactions
);

// * Request Integration

router.post(
  "/requestIntegration",
  authController.protectCommunity,
  globalController.requestIntegration
);

// * Build with Bluemeet

router.post(
  "/buildWithBluemeet",
  authController.protectCommunity,
  globalController.buildWithBluemeet
);

router.post(
  "/startSessionRecording/:channelName",
  globalController.acquireRecordingResource,
  globalController.getRecordingStatus
);
router.get(
  "/getRecordingStatus/:sessionId",
  globalController.getRecordingStatus
);
router.post(
  "/stopSessionRecording/:sessionId",
  globalController.stopCloudRecording
);

router.get("/getEventSpeakers/:eventId", globalController.getEventSpeakers);

router.get("/getPeopleInEvent/:eventId", globalController.getPeopleInEvent);
router.get(
  "/getMyAllPersonalChatMsg/:userId",
  globalController.getMyAllPersonalChatMsg
);
router.get(
  "/fetchInvitationDetails/:invitationId",
  globalController.fetchInvitationDetails
);

router.get(
  "/getEventDetailsForMagicLinkPage/:registrationId",
  globalController.getEventDetailsForMagicLinkPage
);

router.get(
  "/getSpeakerRegistrationInfoForMagicLinkPage/:registrationId",
  globalController.getSpeakerRegistrationInfoForMagicLinkPage
);

router.get(
  "/getExhibitorRegistrationInfoForMagicLinkPage/:registrationId",
  globalController.getExhibitorRegistrationInfoForMagicLinkPage
);

router.get(
  "/getEventTables/:eventId",
  authController.protect,
  globalController.fetchEventTables
);

router.post(
  "/editTable/:tableId",
  authController.protect,
  globalController.editTable
);

router.get(
  "/getTableDetails/:tableId",
  authController.protect,
  globalController.getTableDetails
);

router.get(
  "/getTableChats/:tableId",
  authController.protect,
  globalController.getTableChats
);

router.get(
  "/getSessionQnA/:sessionId",
  authController.protect,
  globalController.fetchSessionQnA
);

module.exports = router;
