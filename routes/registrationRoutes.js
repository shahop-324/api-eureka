const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const registrationController = require("../controllers/registrationController");

const router = express.Router();

// Route for getting all registrations of a community
router.get(
  "/community/getAll",
  authController.protectCommunity,
  registrationController.getAllRegistrations
);

// Route for getting all registrations of one particular event
router.get(
  "/event/:eventId/getAllRegistration",
  authController.protectCommunity,
  registrationController.getAllRegistrationsForOneEvent
);

router.get(
  "/:id/getOne",
  authController.protectCommunity,
  registrationController.getOneRegistration
);

module.exports = router;
