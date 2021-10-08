const catchAsync = require("../utils/catchAsync");
const Event = require("../models/eventModel");
const Community = require("../models/communityModel");
const Registration = require("../models/registrationsModel");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

exports.getAllRegistrations = catchAsync(async (req, res, next) => {
  // TODO Implement get all registrations for a community

  const communityId = req.community.id;

  const registrations = await Registration.find({
    eventByCommunityId: communityId,
  });

  res.status(200).json({
    status: "success",
    length: registrations.length,
    data: registrations,
  });
});

exports.getOneRegistration = catchAsync(async (req, res, next) => {
  const registrationId = req.params.id;
  const registration = await Registration.findById(registrationId);

  res.status(200).json({
    status: "success",
    data: registration,
  });
});

exports.getAllRegistrationsForOneEvent = catchAsync(async (req, res, next) => {
  const json = await Event.findById(req.params.eventId)
    .select("registrations")
    .populate({
      path: "registrations",
    });

  const obj = await JSON.parse(JSON.stringify(json));
  const { registrations } = obj;

  res.status(200).json({
    status: "success",
    length: registrations.length,
    data: registrations,
  });
});

exports.sendInvite = catchAsync(async (req, res, next) => {
  const registrationId = req.params.registrationId;

  const RegistrationDoc = await Registration.findById(registrationId);

  const invitationLink = RegistrationDoc.invitationLink;
  const userEmail = RegistrationDoc.userEmail;
  const userName = RegistrationDoc.userName;

  const msg = {
    to: userEmail, // Change to your recipient
    from: "shreyanshshah242@gmail.com", // Change to your verified sender
    subject: "Your Event Invitation Link",
    text: `Hi, ${userName} use this link to join this event. ${invitationLink}.`,
    // html: TeamInviteTemplate(urlToBeSent, communityDoc, userDoc),
  };

  sgMail
    .send(msg)
    .then(async () => {
      console.log("Invitation sent to attendee.");

      res.status(200).json({
        status: "success",
        message: "invitation sent to attendee.",
      });
    })
    .catch(async (error) => {
      console.log("Failed to send invitation to attendee");

      res.status(400).json({
        status: "failed",
        message: "failed to send invitation to attendee.",
      });
    });
});

exports.sendBulkInvite = catchAsync(async (req, res, next) => {
  const bulkMailInfo = req.body;

  for (let element of bulkMailInfo) {
    const msg = {
      to: element.email, // Change to your recipient
      from: "shreyanshshah242@gmail.com", // Change to your verified sender
      subject: "Your Event Invitation Link",
      text: `Hi, ${element.name} use this link to join this event (${element.eventName}). ${element.link}.`,
      // html: TeamInviteTemplate(urlToBeSent, communityDoc, userDoc),
    };

    sgMail
      .send(msg)
      .then(async () => {
        console.log("Invitation sent successfully!");
      })
      .catch(async (error) => {
        console.log("Failed to send invitation.");
      });
  }

  res.status(200).json({
    status: "success",
    message: "invitation sent successfully!",
  });
});
