const express = require('express');
const globalController = require('../controllers/globalController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/exploreEvents/madeJustForYou').get(globalController.aliasTopEvents,globalController.getAllEvents);

router.get('/exploreEvents', globalController.getAllEvents);

router.post('/generateEventAccessToken', globalController.createEventAccessToken);

router.post('/getRTCVideoCallToken', authController.protect, globalController.generateTokenForVideoCall);

router.post('/getRTMToken', authController.protect, globalController.generateRTMToken);

module.exports = router;
