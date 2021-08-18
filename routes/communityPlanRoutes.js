const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const eventController = require("../controllers/eventController");
const registrationController = require("../controllers/registrationController");
const couponController = require("../controllers/couponController");
const reviewController = require("../controllers/reviewController");
const queriesController = require("../controllers/queriesController");
const teamController = require("../controllers/teamController");
const feedbackController = require("../controllers/feedbackController");
const billingController = require("../controllers/billingController");
const communityController = require("../controllers/communityController");
const router = express.Router();

router.post(
  "/switchToFree",
  authController.protect,
  billingController.switchToFreePlan
);

module.exports = router;
