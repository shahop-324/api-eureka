const catchAsync = require("../utils/catchAsync");
const Speaker = require("../models/speakerModel");
const apiFeatures = require("../utils/apiFeatures");
const mongoose = require("mongoose");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getParticularSpeaker = catchAsync(async (req, res, next) => {
  const speaker = await Speaker.findById(req.params.id).populate("sessions");

  res.status(200).json({
    status: "SUCCESS",

    data: {
      speaker,
    },
  });
});

exports.updateSpeaker = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "status",
    "firstName",
    "lastName",
    "email",
    "image",
    "organisation",
    "bio",
    "sessions",
    "socialMediaHandles",
    "image"
  );

  const updatedSpeaker = await Speaker.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      validateModifiedOnly: true,
    }
  ).populate("sessions");

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

  const id = deletedSpeaker.id;

  res.status(200).json({
    status: "success",
    id,
  });
});

exports.getAllSpeakers = catchAsync(async (req, res, next) => {
  const query = Speaker.find({
    eventId: mongoose.Types.ObjectId(req.params.eventId),
    // sessionId: mongoose.Types.ObjectId(req.query.sessionId),
  }).populate("sessions");

  const features = new apiFeatures(query, req.query)
    .textFilter()
    .sessionFilter();
  const speakers = await features.query;

  res.status(200).json({
    status: "SUCCESS",
    data: {
      speakers,
    },
  });
});

exports.sendInvitation = catchAsync(async (req, res, next) => {
  const speakerId = req.params.speakerId;

  const speakerName = req.body.name;
  const speakerEmail = req.body.email;
  const invitationLink = req.body.invitationLink;
  const sessions = req.body.sessions;

  // Send invitation and mark that invitation is sent to this speaker

  const msg = {
    to: speakerEmail, // Change to your recipient
    from: "shreyanshshah242@gmail.com", // Change to your verified sender
    subject: "Your Event Invitation Link",
    text: `Hi, ${speakerName} use this link to join this event as a speaker. ${invitationLink}. You have been invited in these sessions ${sessions}`,
    // html: TeamInviteTemplate(urlToBeSent, communityDoc, userDoc),
  };

  sgMail
    .send(msg)
    .then(async () => {
      console.log("Invitation sent to speaker.");
      // Mark that invitation is sent
      const updatedSpeaker = await Speaker.findByIdAndUpdate(
        speakerId,
        { invitationStatus: "Sent" },
        { new: true, validateModifiedOnly: true }
      );

      res.status(200).json({
        status: "success",
        message: "invitation sent to speaker.",
        data: updatedSpeaker,
      });
    })
    .catch(async (error) => {
      console.log("Failed to send invitation to speaker");
      // Mark that invitation is not yet sent
      const updatedSpeaker = await Speaker.findByIdAndUpdate(
        speakerId,
        { invitationStatus: "Not sent" },
        { new: true, validateModifiedOnly: true }
      );

      res.status(400).json({
        status: "failed",
        message: "failed to send invitation to speaker.",
        data: updatedSpeaker,
      });
    });


  
});
