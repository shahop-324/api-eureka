const catchAsync = require("../utils/catchAsync");
const Session = require("../models/sessionModel");
const mongoose = require("mongoose");
const apiFeatures = require("../utils/apiFeatures");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getParticularSession = catchAsync(async (req, res, next) => {
  const session = await Session.findById(req.params.id).populate("speaker");


  res.status(200).json({
    status: "SUCCESS",

    data: {
      session,
    },
  });
});

exports.updateSession = catchAsync(async (req, res, next) => {

  const filteredBody = filterObj(
    req.body,
    "name",
    "description",
    "startDate",
    "startTime",
    "endDate",
    "endTime",
    "speaker"
  );

  const updatedSession = await Session.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      validateModifiedOnly: true,
    }
  ).populate("speaker");

  res.status(200).json({
    status: "success",
    data: { updatedSession },
  });
});

exports.DeleteSession = catchAsync(async (req, res, next) => {
  const sessionId = req.params.id;

  const deletedSession = await Session.findByIdAndUpdate(
    sessionId,
    { status: "Deleted" },
    { new: true, validateModifiedOnly: true }
  );

  const id = deletedSession.id;

  res.status(200).json({
    status: "success",
    data: {id},
  });
});

exports.getAllSessions = catchAsync(async (req, res, next) => {

  const query = Session.find({
    eventId: mongoose.Types.ObjectId(req.params.eventId),
   // sessionId: mongoose.Types.ObjectId(req.query.sessionId),

  }).populate('speaker');

  const features = new apiFeatures(query, req.query).textFilter();
  const sessions = await features.query;

 
  res.status(200).json({
    status: "SUCCESS",
    data: {
      sessions,
    },
  });
});

exports.getAllSessionsForUser = catchAsync(async (req, res, next) => {

  const query = Session.find({
    eventId: mongoose.Types.ObjectId(req.params.eventId),
   // sessionId: mongoose.Types.ObjectId(req.query.sessionId),

  }).populate('speaker');

  const features = new apiFeatures(query, req.query).textFilter();
  const sessions = await features.query;

  res.status(200).json({
    status: "SUCCESS",
    data: {
      sessions,
    },
  });
});