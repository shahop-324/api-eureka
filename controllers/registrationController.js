/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

const catchAsync = require("../utils/catchAsync");
const Event = require("../models/eventModel");
const Community = require("../models/communityModel");
const Registration = require("../models/registrationsModel");

exports.getAllRegistrations = catchAsync(async (req, res, next) => {
  // TODO Implement get all registrations for a community

  const communityId = req.community.id;

  const registrations = await Registration.find({ eventByCommunityId: communityId });

  console.log(registrations);

  res.status(200).json({
    status: "success",
    length: registrations.length,
    data: registrations,
  });
});

exports.getOneRegistration = catchAsync(async (req, res, next) => {
  const registrationId = req.params.id;
  const registration = await Registration.findById(registrationId);

  console.log(registration);

  res.status(200).json({
    status: 'success',
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

  console.log(obj.registrations, "These are all this event's registrations.");


  res.status(200).json({
    status: "success",
    length: registrations.length,
    data: registrations,
  });
});
