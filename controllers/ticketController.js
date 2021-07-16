const catchAsync = require("./../utils/catchAsync");

const Ticket = require("./../models/ticketModel");

exports.deleteTicket = catchAsync(async(req, res, next) => {
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
