const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError.js");
const CommunityCredentials = require("../models/CommunityCredentialsModel");
const Event = require("../models/eventModel");
const Community = require("../models/communityModel");

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

  // // 3) If everything ok, send pass on to next middleware
  // res.status(200).json({
  //   status: "success",
  //   message: "This requested has been successfully authenticated",
  // });
});

exports.getAllEvents = catchAsync(async (req, res, next) => {
  // Community for which we want to query events
  const communityId = req.community.id;

  console.log(req);
  const events = await Event.find({
    createdBy: mongoose.Types.ObjectId(communityId),
  });

  res.status(200).json(events);
});
