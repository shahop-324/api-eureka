const express = require("express");

const authController = require("../controllers/authController");
const eventController = require("../controllers/eventController");
const speakerController = require("../controllers/speakerController");
const sessionController = require("../controllers/sessionController");
const ticketController = require("../controllers/ticketController");
const router = express.Router();

router.patch(
  "/:id/update",
  authController.protectCommunity,
  eventController.updateEvent
);

router.patch(
  "/:id/updateEventDescription",
  authController.protectCommunity,
  eventController.updateEventDescription
);

router.post(
  "/:eventId/addSession",
  authController.protectCommunity,
  eventController.addSession
);
router.post(
  "/:eventId/addSpeaker",
  authController.protectCommunity,
  eventController.addSpeaker
);
router.get(
  "/:eventId/sessions",
  authController.protectCommunity,
  sessionController.getAllSessions
);
router.get(
  "/:eventId/sessionsForUser",
  authController.protect,
  sessionController.getAllSessionsForUser
);
router.get(
  "/:eventId/speakers",
  authController.protectCommunity,
  speakerController.getAllSpeakers
);

router.get(
  "/:id/getNetworkSettings",
  authController.protectCommunity,
  eventController.getNetworkSettings
);

router.get(
  "/:eventId/tickets",
  authController.protectCommunity,
  ticketController.getAllTickets,
);

router.get(
  "/:id/ticket",
  authController.protectCommunity,
  eventController.getOneTicket,
);

router.patch(
  "/:id/updateTicket",
  authController.protectCommunity,
  eventController.updateTicket,
);

router.delete(
  "/:id/deleteTicket",
  authController.protectCommunity,
  eventController.deleteTicket,
);

router.patch(
  "/:id/updateNetworking",
  authController.protectCommunity,
  eventController.updateNetworking,
);


module.exports = router;
