const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const eventController = require('../controllers/eventController');
const registrationController = require('../controllers/registrationController');
const couponController = require('../controllers/couponController');
const reviewController = require('../controllers/reviewController');
const queriesController = require('../controllers/queriesController');
const teamController = require('../controllers/teamController');
const feedbackController = require('../controllers/feedbackController');
const billingController = require('../controllers/billingController');

const router = express.Router();

// DONE Creating a new Event from a Community
router.post(
  '/events/new',
  authController.protectCommunity,
  eventController.createEvent
);

// DONE Getting all events For a Community
// protectCommunity routes contains user and community which user enter in community for restrictation and community for which community you wants all events
router.get(
  '/events',
  authController.protectCommunity,
  eventController.getAllEventsForCommunities
);

// Done Getting One Particular event For a Community
router.get(
  '/events/:eventId',
  authController.protectCommunity,
  eventController.getOneEventForCommunities
);

//Done Getting all registrations for a particular community
router.get(
  '/registrations',
  authController.protectCommunity,
  registrationController.getAllRegistrations
);

// DONE Getting all registrations for a particular event
router.get(
  '/registrations/:eventId',
  authController.protectCommunity,
  registrationController.getAllRegistrationsForOneEvent
);

// Done Enabling community to create a Coupon for any of their events
router.post(
  '/coupons/:eventId',
  authController.protectCommunity,
  couponController.CreateNewCoupon
);

// DONE Getting all coupons which are created by a community
router.get(
  '/coupons',
  authController.protectCommunity,
  couponController.getAllCoupons
);

// DONE Updating coupon For a Community
router.patch(
  '/coupons/:couponId',
  authController.protectCommunity,
  couponController.UpdateCoupon
);

// DONE Deleting coupons for a community (set active property to false)
router.delete(
  '/coupons/:couponId',
  authController.protectCommunity,
  couponController.DeleteCoupon
);

// DONE Getting all reviews for a community
router.get(
  '/reviews',
  authController.protectCommunity,
  reviewController.getAllReviews
);

// DONE Getting all reviews for a particular event
router.get(
  '/reviews/:eventId',
  authController.protectCommunity,
  reviewController.getAllReviewsForOneEvent
);

router.get(
  '/queries',
  authController.protectCommunity,
  queriesController.getAllQueries
);

router.get(
  '/queries/:id',
  authController.protectCommunity,
  queriesController.getAllQueriesForOneEvent
);

router.post(
  '/queries',
  authController.protectCommunity,
  queriesController.answerQuery
);

// TODO Team features will be done after we have our react UI in place
router.get(
  '/team',
  authController.protectCommunity,
  teamController.getAllTeamMembers
);

// TODO Team features will be done after we have our react UI in place
router.post(
  '/team',
  authController.protectCommunity,
  teamController.addNewTeamMember
);

// TODO Team features will be done after we have our react UI in place
router.delete(
  '/team',
  authController.protectCommunity,
  teamController.removeOneTeamMember
);

// TODO
router.get(
  '/billing',
  authController.protectCommunity,
  billingController.getAllBills
);

// TODO
router.post(
  '/billing',
  authController.protectCommunity,
  billingController.payBill
);

// Done adding booths to an event
router.patch(
  '/booths/:eventId',
  authController.protectCommunity,
  eventController.createBooth
);

// Done adding sponsors to an event
router.post(
  '/sponsors/:eventId',
  authController.protectCommunity,
  eventController.addSponsor
);

// Done adding speakers to an event
router.post(
  '/:eventId/addSpeaker',
  authController.protectCommunity,
  eventController.addSpeaker
);
// add sessions routes
router.post(
  '/:eventId/addSession',
  authController.protectCommunity,
  eventController.addSession
);
router.patch(
  '/:eventId/:speakerId/updateSpeaker',
  authController.protectCommunity,
  eventController.updateSpeaker
);
router.patch(
  '/:eventId/:sessionId/updateSession',
  authController.protectCommunity,
  eventController.updateSession
);

module.exports = router;
