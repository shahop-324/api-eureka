const express = require("express");
const globalController = require("../controllers/globalController");
const authController = require("./../controllers/authController");
const chatMessagesController = require("../controllers/chatMessageController");
const eventAlertController = require("../controllers/eventAlertController");
const eventPollController = require("../controllers/eventPollController");
const networkingController = require("./../controllers/networkingController");
const userController = require("./../controllers/userController");

const videoController = require("./../controllers/videoController");

const router = express.Router();

router.post("/generateCodes", globalController.generateCodes);

router.get("/getCodes", globalController.getCodes);

router.post(
  "/redeemAppSumoCode",
  authController.protectCommunity,
  globalController.redeemAppSumoCode
);

router.post(
  "/fetchEventVideos",
  authController.protectCommunity,
  videoController.getEventVideos
);

router.post(
  "/linkVideo",
  authController.protectCommunity,
  videoController.linkVideo
);

router.post(
  "/unlinkVideo",
  authController.protectCommunity,
  videoController.unlinkVideo
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

router.get("/exploreEvents/madeJustForYou", globalController.getAllEvents);

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
  "/getPreviousBackstageMsg/:sessionId",
  chatMessagesController.getPreviousBackstageChatMessage
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
  "/getLiveStageToken",
  authController.protect,
  globalController.getLiveStageToken
);

router.post(
  "/getBackstageToken",
  authController.protect,
  globalController.getBackstageToken
);

router.post(
  "/getLiveStreamingTokenForJoiningTable",
  globalController.generateLiveStreamingTokenForJoiningTable
);

router.post("/getTokenForBoothTable", globalController.getTokenForBoothTable);

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
  "/getTokenForBoothScreenShare",
  globalController.generateTokenForBoothScreenShare
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
  "/getPeopleOnBoothTable/:tableId",
  globalController.getPeopleOnBoothTable
);

router.get(
  "/getPeopleOnLoungeTable/:tableId",
  globalController.getPeopleOnLoungeTable
);

router.get(
  "/getSessionSpeakersTagsTracks/:eventId",
  globalController.getSessionSpeakersTagsTracks
);

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

router.get(
  "/getBoothTables/:boothId",
  authController.protect,
  globalController.fetchBoothTables
);

router.post(
  "/editTable/:tableId",
  authController.protect,
  globalController.editTable
);

router.post(
  "/editBoothTable/:tableId",
  authController.protect,
  globalController.editBoothTable
);

router.get(
  "/getTableDetails/:tableId",
  authController.protect,
  globalController.getTableDetails
);

router.get(
  "/getBoothTableDetails/:tableId",
  authController.protect,
  globalController.getBoothTableDetails
);

router.get(
  "/getTableChats/:tableId",
  authController.protect,
  globalController.getTableChats
);

router.get(
  "/getBoothTableChats/:tableId",
  authController.protect,
  globalController.getBoothTableChats
);

router.get(
  "/getBoothChats/:boothId",
  authController.protect,
  globalController.getBoothChats
);

router.get(
  "/getSessionQnA/:sessionId",
  authController.protect,
  globalController.fetchSessionQnA
);

router.get(
  "/getSessionPolls/:sessionId",
  authController.protect,
  globalController.fetchSessionPoll
);

router.post(
  "/sendStageReminder/:sessionId/:userId/:msg",
  authController.protect,
  globalController.sendStageReminder
);

router.get(
  "/getEventRegistrations/:eventId",
  authController.protect,
  globalController.getEventRegistrations
);

router.get(
  "/getPeopleInThisEvent/:eventId",
  authController.protect,
  globalController.getPeopleInThisEvent
);

router.post(
  "/resendCommunityVerificationMail/:id",
  globalController.resendCommunityVerificationMail
);

router.post(
  "/resendUserVerificationEmail/:id",
  globalController.resendUserVerificationEmail
);

router.post(
  "/resendPayPalEmailVerificationLink/:communityId",
  authController.protectCommunity,
  globalController.resendPayPalEmailVerificationLink
);

router.post(
  "/createUserAccountRequest",
  globalController.createUserAccountRequest
);

router.post("/forgotPassword", userController.forgotPassword);

router.post(
  "/changeCommunityAccountRequestEmail/:id",
  authController.protect,
  globalController.changeCommunityAccountRequestEmail
);

router.get(
  "/getPeopleInThisSession/:sessionId",
  authController.protect,
  globalController.getPeopleInThisSession
);

router.get(
  "/fetchLatestEvent",
  authController.protectCommunity,
  globalController.getLatestEvent
);

router.get(
  "/getArchivedEvents/:communityId",
  authController.protectCommunity,
  globalController.getArchivedEvents
);
router.get(
  "/duplicateEvent/:eventId",
  authController.protectCommunity,
  globalController.duplicateEvent
);

router.get("/getShowcaseEvents", globalController.getShowcaseEvents);

router.post(
  "/editPayPalPayoutEmail/:communityId",
  authController.protectCommunity,
  globalController.editPayPalPayoutEmail
);

router.get("/verifyPayPalEmail/:id", globalController.verifyPayPalEmail);

router.get(
  "/fetchPaypalPayouts/:communityId",
  authController.protectCommunity,
  globalController.fetchPaypalPayouts
);

router.post(
  "/createPayPalPayoutRequest/:communityId",
  authController.protectCommunity,
  globalController.createPayPalPayoutRequest
);

router.get(
  "/fetchRegistrations/:eventId",
  authController.protectCommunity,
  globalController.fetchRegistrations
);

router.post(
  "/reportEvent/:eventId",
  authController.protect,
  globalController.reportEvent
);

router.get("/getCoupons/:eventId", globalController.getCoupons);

router.get(
  "/fetchEventBooth/:boothId",
  authController.protect,
  globalController.getEventBooth
);

router.get(
  "/fetchEventReportedMessages/:eventId",
  authController.protect,
  globalController.fetchEventReportedMessages
);

router.get(
  "/getHighlightedSessions/:eventId",
  globalController.getHighlightedSessions
);

router.post(
  "/acceptInEvent/:eventId/:userId",
  authController.protectCommunity,
  globalController.acceptInEvent
);

router.post(
  "/resetEventLabels/:eventId",
  authController.protectCommunity,
  globalController.resetEventLabels
);

router.post(
  "/hideReview/:reviewId",
  authController.protectCommunity,
  globalController.hideReview
);

router.post(
  "/showReview/:reviewId",
  authController.protectCommunity,
  globalController.showReview
);

router.get(
  "/fetchCheckListDetails/:eventId",
  authController.protect,
  globalController.getChecklistDetails
);

router.post(
  "/updateStreamingUsage/:eventId/:duration",
  authController.protect,
  globalController.updateStreamingUsage
);

router.post(
  "/uninstallHubspot/:communityId",
  authController.protectCommunity,
  globalController.uninstallHubspot
);

router.post(
  "/uninstallFacebookPixel/:communityId",
  authController.protectCommunity,
  globalController.uninstallFacebookPixel
);

router.post(
  "/uninstallGoogleAnalytics/:communityId",
  authController.protectCommunity,
  globalController.uninstallGoogleAnalytics
);

router.post(
  "/uninstallTawk/:communityId",
  authController.protectCommunity,
  globalController.uninstallTawk
);

router.post(
  "/uninstallTypeform/:communityId",
  authController.protectCommunity,
  globalController.uninstallTypeform
);

module.exports = router;
