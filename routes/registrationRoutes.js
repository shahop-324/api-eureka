const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

// Route for Collecting general Intent and Profile Completion
router
  .post('/generalIntent', authController.protect, userController.generalIntent)
  .post(
    '/profileCompletion',
    authController.protect,
    userController.profileCompletion
  );

module.exports = router;
