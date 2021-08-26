const catchAsync = require("../utils/catchAsync");
const Event = require("../models/eventModel");
const Session = require("../models/sessionModel");

exports.getPreviousEventChatMessage = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  const eventChatMessages = await Event.findById(eventId)
    .select("chatMessages")
    .populate("chatMessages");

  res.status(200).json({
    status: "success",
    data: eventChatMessages,
  });
});

exports.getPreviousSessionChatMessage = catchAsync(async (req, res, next) => {
  const sessionId = req.params.sessionId;

  const sessionChatMessages = await Session.findById(sessionId)
    .select("chatMessages")
    .populate("chatMessages");

  res.status(200).json({
    status: "success",
    data: sessionChatMessages,
  });
});
