const express = require("express");

const authController = require("../controllers/authController");
const razorpay = require("../services/payments/Razorpay");

const router = express.Router();

router.post(
  "/createRazorpayOrder",
  authController.protect,
  razorpay.createRazorpayOrder
);

router.post(
  "/createCommunityPlanOrder",
  authController.protect,
  razorpay.createOrderForCommunityPlan
);

router.post(
  "/listenForSuccessfulRegistration",
  razorpay.listenForSuccessfulRegistration
);

module.exports = router;
