const catchAsync = require("../utils/catchAsync");
const Session = require("../models/sessionModel");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getParticularSession = catchAsync(async (req, res, next) => {
  const session = await Session.findById(req.params.id).populate("speaker");
  console.log(session);

  res.status(200).json({
    status: "SUCCESS",

    data: {
      session,
    },
  });
});

exports.updateSession = catchAsync(async (req, res, next) => {
  console.log(req.body, 90897, 25);
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
