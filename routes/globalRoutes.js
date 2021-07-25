const express = require('express');
const globalController = require('../controllers/globalController');

const router = express.Router();

router.route('/exploreEvents/madeJustForYou').get(globalController.aliasTopEvents,globalController.getAllEvents);


router.get('/exploreEvents', globalController.getAllEvents);

router.post('/generateEventAccessToken', globalController.createEventAccessToken);


module.exports = router;
