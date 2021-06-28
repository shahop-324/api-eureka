/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

const catchAsync = require('../utils/catchAsync');
const Event = require('../models/eventModel');
const Community = require('../models/communityModel');

exports.getAllRegistrations = catchAsync(async (req, res, next) => {
  // TODO Implement get all registrations for a community
  //get all registrations of particular community of all events in community we have arrays of events id storing ref of event ids we have req.community.id

  const json = await Community.findById(req.community._id)
    .populate({
      path: 'registrations',
      select: 'name photo email ticketType eventName',
    })
    .select('registrations');
  const obj = await JSON.parse(JSON.stringify(json));
  const { registrations } = obj;

  // console.log(obj.registrations);
  res.status(200).json({
    status: 'success',
    length: registrations.length,
    data: registrations,
  });
});

exports.getAllRegistrationsForOneEvent = catchAsync(async (req, res, next) => {
  const json = await Event.findById(req.params.eventId).select('registrations').populate({
    path: 'registrations',
    select: 'name photo email ticketType',
  });;

  const obj = await JSON.parse(JSON.stringify(json));
  const { registrations } = obj;

  // console.log(obj.registrations);
  res.status(200).json({
    status: 'success',
    length: registrations.length,
    data: registrations,
  });
});


