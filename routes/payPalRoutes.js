const express = require("express");

const PayPalAccessToken = require("../services/PayPal/AccessToken");

const router = express.Router();

router.get(
  "/getPayPalAccessToken",
  PayPalAccessToken.getPayPalAccessToken
);

module.exports = router;
