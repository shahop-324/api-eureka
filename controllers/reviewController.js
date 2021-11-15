const Community = require("../models/communityModel");
const Event = require("../models/eventModel");
const Review = require("./../models/reviewModel");
const catchAsync = require("../utils/catchAsync");

exports.fetchReviews = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;
});

exports.createReview = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;
  const userId = req.params.userId;
});
