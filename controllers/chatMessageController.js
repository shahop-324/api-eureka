const catchAsync = require("../utils/catchAsync");
const Event = require("../models/eventModel");

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
