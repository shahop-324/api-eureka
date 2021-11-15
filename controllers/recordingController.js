const Community = require("../models/communityModel");
const Event = require("../models/eventModel");
const Recording = require("./../models/recordingModel");
const catchAsync = require("../utils/catchAsync");

exports.fetchRecordings = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;
});

exports.createRecording = catchAsync(async (req, res, next) => {
  const url = req.params.url;
  const sessionId = req.params.sessionId;
});
