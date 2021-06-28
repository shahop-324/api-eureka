const express = require('express');
const globalController = require('../controllers/globalController');
// const passport = require('passport');
const router = express.Router();
// router.get('/exploreEvents', passport.authenticate('google'));
router.get('/exploreEvents', globalController.getAllEvents);
router.get('/', (req, res, next) => {
  res.send('hello from server');
});

module.exports = router;
