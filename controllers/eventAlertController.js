const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");
const EventAlerts = require("../models/eventAlertsModel");

exports.getPreviousEventAlert = catchAsync(async (req, res, next) => {
  try {
    const eventId = req.params.eventId;

    const eventAlerts = await EventAlerts.find({
      $and: [{ eventId: mongoose.Types.ObjectId(eventId) }, { deleted: false }],
    }).populate("userId", "firstName lastName email image");

    res.status(200).json({
      status: "success",
      data: eventAlerts,
    });
  } catch (error) {
    console.log(error);
  }
});
