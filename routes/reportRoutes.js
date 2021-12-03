const express = require("express");

const authController = require("../controllers/authController");
const eventReportsController = require("../controllers/eventReportsController");

const router = express.Router();

router.get(
  "/generateEventSummaryReport/:eventId",
  authController.protect,
  eventReportsController.generateEventSummaryReport
);

router.get(
  "/generateEventAttendenceReport/:eventId",
  authController.protect,
  eventReportsController.generateEventAttendenceReport
);

router.post(
  "/generateSessionAttendenceReport/:eventId",
  authController.protect,
  eventReportsController.generateSessionAttendenceReport
);

router.post(
  "/generateBoothAttendenceReport/:eventId",
  authController.protect,
  eventReportsController.generateBoothAttendenceReport
);

router.get(
  "/generateScheduleReport/:eventId",
  authController.protect,
  eventReportsController.generateScheduleReport
);

router.post(
  "/generatePollReport/:eventId",
  authController.protect,
  eventReportsController.generatePollReport
);

router.post(
  "/generateQnAReport/:eventId",
  authController.protect,
  eventReportsController.generateQnAReport
);

router.get(
  "/generateNetworkingReport/:eventId",
  authController.protect,
  eventReportsController.generateNetworkingReport
);

router.get(
  "/generateEventChatReport/:eventId",
  authController.protect,
  eventReportsController.generateEventChatReport
);

router.post(
  "/generateSessionChatReport/:eventId",
  authController.protect,
  eventReportsController.generateSessionChatReport
);

router.post(
  "/generateBoothChatReport/:eventId",
  authController.protect,
  eventReportsController.generateBoothChatReport
);

router.get(
  "/generateRegisteredUsersReport/:eventId",
  authController.protect,
  eventReportsController.generateRegisteredUsersReport
);

router.post(
  "/generateViewershipCountReport/:eventId",
  authController.protect,
  eventReportsController.generateViewershipCountReport
);

router.get(
  "/generateAttendeeScoreReport/:eventId",
  authController.protect,
  eventReportsController.generateAttendeeScoreReport
);

router.post(
  "/generateSharedBusinessCardReport/:eventId",
  authController.protect,
  eventReportsController.generateSharedBusinessCardReport
);

router.get(
  "/generateEventAlertReport/:eventId",
  authController.protect,
  eventReportsController.generateEventAlertReport
);

router.get(
  "/generateDemographicReport/:eventId",
  authController.protect,
  eventReportsController.generateDemographicReport
);

module.exports = router;
