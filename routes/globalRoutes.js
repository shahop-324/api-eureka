const express = require('express');
const globalController = require('../controllers/globalController');

const router = express.Router();

router.route('/madeJustForYou').get(globalController.aliasTopEvents,globalController.getAllEvents);


router.get('/', globalController.getAllEvents);


module.exports = router;
