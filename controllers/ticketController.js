const catchAsync = require("./../utils/catchAsync");
const mongoose = require("mongoose");
const apiFeatures = require("../utils/apiFeatures");
const Ticket = require("./../models/ticketModel");

exports.deleteTicket = catchAsync(async (req, res, next) => {
  const ticketId = req.params.id;
  await Ticket.findByIdAndUpdate(
    ticketId,
    { status: "Deleted" },
    { new: true, validateModifiedOnly: true }
  );

  res.status(200).json({
    status: "success",
  });
});

exports.getAllTickets = catchAsync(async (req, res, next) => {
  console.log(req.query, 19);

  const query = Ticket.find({
    eventId: mongoose.Types.ObjectId(req.params.eventId),
  });

  const features = new apiFeatures(query, req.query).textFilter();
  const tickets = await features.query;

  console.log(tickets);
  res.status(200).json({
    status: "SUCCESS",
    data: {
      tickets,
    },
  });
});
