const express = require("express");

const authController = require("../controllers/authController");
const stripeService = require("../services/payments/stripeConnect");
const router = express.Router();

router.post(
  "/createStripeAccount",
  authController.protectCommunity,
  stripeService.createStripeAccount
);

module.exports = router;