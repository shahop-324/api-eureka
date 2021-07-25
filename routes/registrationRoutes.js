const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const registrationController = require("../controllers/registrationController");

const router = express.Router();

// Route for Collecting general Intent and Profile Completion
router.get(
  "/community/getAll",
  authController.protectCommunity,
  registrationController.getAllRegistrations
);

router.get(
  "/:id/getOne",
  authController.protectCommunity,
  registrationController.getOneRegistration
);

module.exports = router;
