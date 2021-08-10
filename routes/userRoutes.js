/* eslint-disable no-unused-vars */
const express = require("express");

const authController = require("../controllers/authController");
const globalController = require("../controllers/globalController");
const userController = require("../controllers/userController");
const communityController = require("../controllers/communityController");
const bodyParser = require("body-parser");

const router = express.Router();
router.post("/googleSignIn", authController.googleSignIn);
router.post("/forgotPassword", userController.forgotPassword);

// user signup router
router.post("/signup", authController.signup);

// user login router
router.post("/login", authController.login);

router.patch("/resetPassword/:token", authController.resetPassword);

//user getting particular event

router.get("/event/:id", userController.getParticularEvent);

// const helperFxn =

router.use((req, res, next) => {
  if (req.user != undefined) {
    return next();
  } else {
    console.log("hello from 32 userRoutes");
    return authController.protect(req, res, next);
  }
});

router.get("/registeredEvents", userController.getAllRegisteredEvents);
router.get("/personalData", userController.getAllPersonalData);
// router.get("/registeredEvents",userController.getAllRegisteredEvents);
// update Me
router.patch("/updateMe", userController.updateMe);

// DONE Creating new Community
router.post("/newCommunity", userController.createNewCommunity);

// ! Select Plan
router.post(
  "/selectPlan",
  authController.protectCommunity,
  communityController.selectPlan
);

// DONE Logining Into a Community
router.post("/:id", authController.communityLogin);

// get all events for user
router.get("/events", globalController.getAllEvents);
// register in an event
router.post(
  "/events/:eventId/:ticketId",

  globalController.IsUserAlreadyRegistred,
  userController.DoesTicketBelongToThisEvent,
  userController.registerInAnEvent
);

// create review for an event in which user participated
router.post(
  "/events/review/:eventId",
  globalController.DoesUserRegistredInThisEvent,
  userController.createReview
);

// create query for an event
router.post(
  "/query/createNew",

  authController.protect,
  userController.createQuery,
  userController.IsUserRegistred
);

//Me
router.get("/Me", userController.getMe);

// delete Me
router.delete("/Me", userController.deleteMe);

// forgot Password (now use email to reset password)
// TODO This route is not getting hits, I have to check and fix it.

// reset Password
router.patch("/updatePassword", authController.updatePassword);

module.exports = router;
