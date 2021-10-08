const express = require("express");
const globalController = require("../controllers/globalController");
const authController = require("./../controllers/authController");
const chatMessagesController = require("../controllers/chatMessageController");
const eventAlertController = require("../controllers/eventAlertController");
const eventPollController = require("../controllers/eventPollController");
const networkingController = require("./../controllers/networkingController");

const router = express.Router();

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
  "/getLiveStreamingToken",
  authController.protect,
  globalController.generateTokenForLiveStreaming
);

router.post(
  "/getLiveStreamingTokenForJoiningTable",
  globalController.generateLiveStreamingTokenForJoiningTable
);

router.post(
  "/getLiveStreamingTokenForSpeaker",
  globalController.generateTokenForLiveStreamingForSpeaker
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

module.exports = router;
