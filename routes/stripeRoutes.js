const express = require("express");

const authController = require("../controllers/authController");
const stripeService = require("../services/payments/stripeConnect");
const router = express.Router();

router.post(
  "/createStripeAccount",
  authController.protectCommunity,
  stripeService.createStripeAccount
);

router.get(
  "/getConnectedAccountStatus",
  authController.protectCommunity,
  stripeService.getConnectedAccountStatus
);

router.post(
  "/getEventRegistrationCheckoutSession",
  authController.protect,
  stripeService.getEventRegistrationCheckoutSession
);

router.post(
  "/connect/listen",
  stripeService.ListenForEvents
);

module.exports = router;
