const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError.js");
const CommunityCredentials = require("../models/CommunityCredentialsModel");
const Event = require("../models/eventModel");
const Community = require("../models/communityModel");
const Registration = require("./../models/registrationsModel");

exports.authenticateCommunity = catchAsync(async (req, res, next) => {
  const { apiKey, apiSecret } = req.query;

  console.log(apiKey);
  console.log(apiSecret);

  // 1) Check if apiKey and apiSecret Exist
  if (!apiKey || !apiSecret) {
    return next(new AppError("Please provide apiKey and apiSecret!", 400));
  }

  // 2) Check if community exists && credentials are correct
  const credentialDoc = await CommunityCredentials.findOne({
    APIKey: apiKey,
  }).select("+APISecret");

  if (
    !credentialDoc ||
    !(apiSecret.toString() === credentialDoc.APISecret.toString())
  ) {
    return next(new AppError("Incorrect api key or secret", 401));
  }

  const CommunityDoc = await Community.findById(credentialDoc.communityId);

  // GRANT ACCESS TO PROTECTED ROUTE
  req.community = CommunityDoc;

  next();
});

exports.getAllEvents = catchAsync(async (req, res, next) => {
  // Community for which we want to query events
  const communityId = req.community.id;

  const events = await Event.find({
    createdBy: mongoose.Types.ObjectId(communityId),
  });

  res.status(200).json(events);
});

exports.getRegisteredAttendee = catchAsync(async (req, res, next) => {
  const communityId = req.community.id;

  const registrations = await Registration.find({
    eventByCommunityId: mongoose.Types.ObjectId("6145a526572db4169942cab6"),
    // TODO Replace this string with communityId
  });

  res.status(200).json(registrations);
});

exports.getStartedEvents = catchAsync(async (req, res, next) => {
  const communityId = req.community.id;

  const startedEvents = await Event.find({
    createdBy: mongoose.Types.ObjectId(communityId),
  });

  // Select only those events which has eventTimelineStatus as started

  res.status(200).json(startedEvents);
});

exports.getFinishedEvents = catchAsync(async (req, res, next) => {
  const communityId = req.community.id;

  const startedEvents = await Event.find({
    createdBy: mongoose.Types.ObjectId(communityId),
  });

  // Select only those events which has eventTimelineStatus as finished

  res.status(200).json(startedEvents);
});

exports.getEventReminders = catchAsync(async (req, res, next) => {
  const communityId = req.community.id;

  //  get all event reminders here for this community

  res.status(200).json([]);
});

exports.getNewAttendeesByExternalMeans = catchAsync(async (req, res, next) => {
  const communityId = req.community.id;

  // get all registrations of this community but select only those who have been added via eventbrite or CSV

  res.status(200).json([]);
});

exports.getNewLeads = catchAsync(async (req, res, next) => {
  const communityId = req.community.id;

  // get all leads for this community

  res.status(200).json([]);
});

exports.getInterestedPeople = catchAsync(async (req, res, next) => {
  const communityId = req.community.id;

  // get all interested people for this community

  res.status(200).json([]);
});

exports.getAttendeeQuery = catchAsync(async (req, res, next) => {
  const communityId = req.community.id;

  // get all attendee queries for this event

  res.status(200).json([]);
});

exports.getEventReiviews = catchAsync(async (req, res, next) => {
  const communityId = req.community.id;

  // get all reviews for events of this community

  res.status(200).json([]);
});

exports.getCouponReminders = catchAsync(async (req, res, next) => {
  const communityId = req.community.id;

  // get all coupon reminders for this community

  res.status(200).json([]);
});

exports.getAllCoupon = catchAsync(async (req, res, next) => {
  const communityId = req.community.id;

  // get all coupon for this community

  res.status(200).json([]);
});

exports.getAllAffiliate = catchAsync(async(req, res, next) => {
  const communityId = req.community.id;

  // get all affiliate for this community

  res.status(200).json([]);
})

exports.getAllTicketReminder = catchAsync(async(req, res, next) => {
  const communityId = req.community.id;

  // get all ticket reminders for this community

  res.status(200).json([]);
})