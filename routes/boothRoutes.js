const express = require("express");

const authController = require("../controllers/authController");
const boothController = require("../controllers/boothController");
const router = express.Router();

router.delete(
    '/:id/delete',
    authController.protectCommunity,
    boothController.deleteBooth
)

module.exports = router;