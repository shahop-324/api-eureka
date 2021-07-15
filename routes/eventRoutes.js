const express = require("express");

const authController = require("../controllers/authController");
const eventController = require("../controllers/eventController");
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
    eventController.getAllSpeakers
  );


  
  
module.exports = router;
