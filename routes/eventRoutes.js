const express = require("express");

const authController = require("../controllers/authController");
const eventController = require("../controllers/eventController");
const speakerController = require("../controllers/speakerController");
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
  "/:id/sessions",
  authController.protectCommunity,
  eventController.getAllSessions
);
router.get(
  "/:id/speakers",
  authController.protectCommunity,
  speakerController.getAllSpeakers
);

router.get(
  "/:id/getNetworkSettings",
  authController.protectCommunity,
  eventController.getNetworkSettings
);

router.get(
  "/:id/tickets",
  authController.protectCommunity,
  eventController.getAllTickets,
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
