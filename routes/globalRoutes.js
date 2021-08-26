const express = require("express");
const globalController = require("../controllers/globalController");
const authController = require("./../controllers/authController");
const chatMessagesController = require("../controllers/chatMessageController");

const router = express.Router();

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

module.exports = router;
