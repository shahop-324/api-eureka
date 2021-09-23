const express = require("express");
const globalController = require("../controllers/globalController");
const authController = require("./../controllers/authController");
const chatMessagesController = require("../controllers/chatMessageController");
const eventAlertController = require("../controllers/eventAlertController");
const eventPollController = require("../controllers/eventPollController");
const networkingController = require("./../controllers/networkingController");
const zapierController = require("./../controllers/zapierController");

const router = express.Router();

router.get(
  "/getAllEvents",
  zapierController.authenticateCommunity,
  zapierController.getAllEvents
);

router.get(
  "/attendeeRegistered",
  zapierController.authenticateCommunity,
  zapierController.getRegisteredAttendee
);

router.get(
  "/eventStarted",
  zapierController.authenticateCommunity,
  zapierController.getStartedEvents
);

router.get(
  "/eventFinished",
  zapierController.authenticateCommunity,
  zapierController.getFinishedEvents
);

router.get("/eventReminder", zapierController.authenticateCommunity, zapierController.getEventReminders);

router.get("/getNewAttendeesByExternalMeans", zapierController.authenticateCommunity, zapierController.getNewAttendeesByExternalMeans);

router.get("/getNewLeads", zapierController.authenticateCommunity, zapierController.getNewLeads);

router.get("/newInterestedPerson", zapierController.authenticateCommunity, zapierController.getInterestedPeople);

router.get("/newAttendeeQuery", zapierController.authenticateCommunity, zapierController.getAttendeeQuery);

router.get("/getEventReiviews", zapierController.authenticateCommunity, zapierController.getEventReiviews);

router.get("/getCouponReminders", zapierController.authenticateCommunity, zapierController.getCouponReminders);

router.get("/getAllAffiliate", zapierController.authenticateCommunity, zapierController.getAllAffiliate);

router.get("/getAllCoupon", zapierController.authenticateCommunity, zapierController.getAllCoupon);

router.get("/getAllTicketReminder", zapierController.authenticateCommunity, zapierController.getAllTicketReminder);

module.exports = router;
