const express = require("express");
const globalController = require("../controllers/globalController");
const authController = require("./../controllers/authController");
const chatMessagesController = require("../controllers/chatMessageController");
const eventAlertController = require("../controllers/eventAlertController");
const eventPollController = require("../controllers/eventPollController");
const networkingController = require("./../controllers/networkingController");
const zapierController = require("./../controllers/zapierController");

const router = express.Router();

router.get("/getAllEvents", zapierController.authenticateCommunity, zapierController.getAllEvents);

module.exports = router;
