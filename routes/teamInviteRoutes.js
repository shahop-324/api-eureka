const express = require("express");
const router = express.Router();
const teamInviteController = require("./../controllers/teamInviteController");
const authController = require("../controllers/authController");

router.post(
  "/create-new",
  authController.protectCommunity,
  teamInviteController.createNewInvitation
);

module.exports = router;
