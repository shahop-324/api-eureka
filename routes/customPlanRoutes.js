const express = require("express");
const communityController = require('../controllers/communityController');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/customPlanGeneration', authController.salesProtect, communityController.customPlanGeneration);

module.exports = router;