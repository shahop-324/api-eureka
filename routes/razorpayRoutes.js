const express = require("express");

const authController = require("../controllers/authController");
const razorpay = require("../services/payments/Razorpay");

const router = express.Router();

router.post("/createAddOnOrder", authController.protectCommunity, razorpay.createAddOnOrder);

router.post(
  "/createCommunityPlanOrder",
  authController.protectCommunity,
  razorpay.createOrderForCommunityPlan
);

router.post(
  "/listenForSuccessfulRegistration",
  razorpay.listenForSuccessfulRegistration
);

module.exports = router;
