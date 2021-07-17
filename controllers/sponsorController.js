const Event = require("../models/eventModel");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");
const apiFeatures = require("../utils/apiFeatures");
const Sponsor = require("./../models/sponsorModel");

exports.getSponsor = catchAsync(async (req, res, next) => {
  const sponsorId = req.params.id;

  const sponsorDoc = await Sponsor.findById(sponsorId);

  res.status(200).json({
    status: "success",
    data: sponsorDoc,
  });
});

exports.deleteSponsor = catchAsync(async (req, res, next) => {
  const sponsorId = req.params.id;

  const deletedSponsor = await Sponsor.findByIdAndUpdate(
    sponsorId,
    { docStatus: "Deleted" },
    { new: true, validateModifiedOnly: true }
  );

  const id = deletedSponsor._id;

  res.status(200).json({
    status: "success",
    data: id,
  });
});

exports.updateSponsor = catchAsync(async (req, res, next) => {
  const sponsorId = req.params.id;

  console.log(sponsorId, "sponsorId");

  const updatedSponsor = await Sponsor.findByIdAndUpdate(
    sponsorId,
    {
      organisationName: req.body.organisationName,
      status: req.body.status,
      website: req.body.website,
    },
    {
      new: true,
      validateModifiedOnly: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: updatedSponsor,
  });
});

// exports.getAllSponsorsOfAnEvent = catchAsync(async (req, res, next) => {
//   const eventId = req.params.id;

//   let sponsors = await Event.findById(eventId)
//     .select("sponsors")
//     .populate("sponsors");

//   console.log(sponsors);

//   sponsors = sponsors.sponsors.filter((sponsor) => sponsor.docStatus !== "Deleted");

//   res.status(200).json({
//     status: "success",
//     data: sponsors,
//   });
// });

exports.getAllSponsors = catchAsync(async (req, res, next) => {
  console.log(req.query, 76);

  const query = Sponsor.find({
    eventId: mongoose.Types.ObjectId(req.params.eventId),
  });

  const features = new apiFeatures(query, req.query).textFilter();
  const sponsors = await features.query;

  console.log(sponsors);
  res.status(200).json({
    status: "SUCCESS",
    data: sponsors,
  });
});