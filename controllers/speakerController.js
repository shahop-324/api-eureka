const catchAsync = require("../utils/catchAsync");
const Speaker = require("../models/speakerModel");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getParticularSpeaker = catchAsync(async (req, res, next) => {
  const speaker = await Speaker.findById(req.params.id).populate("sessions");
  console.log(speaker);

  res.status(200).json({
    status: "SUCCESS",

    data: {
      speaker,
    },
  });
});

exports.updateSpeaker = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const filteredBody = filterObj(
    req.body,
    "status",
    "firstName",
    "lastName",
    "email",
    "image",
    "organisation",
    "headline",
    "sessions",
    "socialMediaHandles",
  );

  console.log('filteredBody',filteredBody);

  const updatedSpeaker = await Speaker.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      validateModifiedOnly: true,
    }
  ).populate("sessions");
   
console.log('updatedSpeaker', updatedSpeaker);
  res.status(200).json({
    status: "success",
    data: { updatedSpeaker },
  });
});

exports.DeleteSpeaker = catchAsync(async (req, res, next) => {
    const speakerId = req.params.id;
  
    const deletedSpeaker = await Speaker.findByIdAndUpdate(
      speakerId,
      { status: "Deleted" },
      { new: true, validateModifiedOnly: true }
    );

    const id = deletedSpeaker.id
  
    res.status(200).json({
      status: "success",
      id,
    });
  });
