const express = require('express');
const globalController = require('../controllers/globalController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/exploreEvents/madeJustForYou').get(globalController.aliasTopEvents,globalController.getAllEvents);


router.get('/exploreEvents', globalController.getAllEvents);

router.post('/generateEventAccessToken', globalController.createEventAccessToken);

router.post('/getRTCVideoCallToken',globalController.nocache, authController.protect, globalController.generateTokenForVideoCall);


module.exports = router;
