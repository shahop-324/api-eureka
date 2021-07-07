/* eslint-disable no-unused-vars */
const express = require("express");

const authController = require("../controllers/authController");
const globalController = require("../controllers/globalController");
const userController = require("../controllers/userController");
const communityController = require("../controllers/communityController");

const router = express.Router();

// user signup router
router.post("/signup", authController.signup);
// user login router
router.post("/login", authController.login);

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
router.get("/auth", (req, res) => {
  res.send("hey i am protected route");
});
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
  "/events/query/:eventId",

  userController.createQuery,
  userController.IsUserRegistred
);

//Me
router.get("/Me", userController.getMe);

// update Me
router.patch("/Me", userController.updateMe);

// delete Me
router.delete("/Me", userController.deleteMe);

// forgot Password (now use email to reset password)
router.post("/forgotPassword", userController.forgotPassword); // TODO This route is not getting hits, I have to check and fix it.

// reset Password
router.patch("/updatePassword", authController.updatePassword);

module.exports = router;
