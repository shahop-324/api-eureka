const express = require("express");

const authController = require("../controllers/authController");
const sessionController = require("../controllers/sessionController");
const router = express.Router();

router.get('/:id',authController.protectCommunity,sessionController.getParticularSession)

  
  
module.exports = router;
