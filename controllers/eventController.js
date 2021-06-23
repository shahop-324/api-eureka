const Event = require('../models/eventModel');
const Community = require('../models/communityModel');
const EventsIdsCommunityWise = require('../models/eventsIdsCommunityWiseModel');
const Speaker = require('../models/speakerModel');
const SpeakersIdsCommunityWise = require('../models/speakersIdsCommunityWiseModel');
const Booth = require('../models/boothModel');
const Sponsor = require('../models/sponsorModel');
const Session = require('../models/sessionModel');

const catchAsync = require('../utils/catchAsync');
const validator = require('validator');

const fillSocialMediaHandler = (InputObject) => {
  const newObj = {};
  for (let key in InputObject) {
    const value = InputObject[key];
    // 2) Check if value is a url
    // 3) if yes then go to next step and fetch only userhandle and then use it to replace old value of key
    // 4) if no then directly use this key value pair and return
    // 5) finally return transformed object having social media keys and corresponding userHandles
    const bool = validator.isURL(value);
    if (bool) {
      // now I have to use regular expression
      switch (key) {
        case 'facebook': {
          let regex = /(?<=com\/).+/;
          [newVal] = value.match(regex);
          newObj[key] = newVal;
          break;
        }
        case 'instagram': {
          let regex = /(?<=com\/).+/;
          [newVal] = value.match(regex);
          newObj[key] = newVal;
          break;
        }
        case 'twitter': {
          let regex = /(?<=com\/).+/;
          [newVal] = value.match(regex);
          newObj[key] = newVal;
          break;
        }
        case 'linkedIn': {
          let regex = /(?<=\/in\/).+/;
          [newVal] = value.match(regex);
          newObj[key] = newVal;
          break;
        }
        case 'website': {
          let regex = /(?<=www.).+/;
          [newVal] = value.match(regex);
          newObj[key] = newVal;
          break;
        }
      }
    } else {
      newObj[key] = value;
    }
  }
  return newObj;
};

/* eslint-disable no-console */
exports.createEvent = catchAsync(async (req, res, next) => {
  console.log(req.community);
  const communityId = req.community._id;
  const communityGettingEvent = await Community.findById(communityId);
  const document = await EventsIdsCommunityWise.findById(
    communityGettingEvent.eventsDocIdCommunityWise
  );
  // 1) Create a new event document with required fields

  const createdEvent = await Event.create({
    eventName: req.body.eventName,
    shortDescription: req.body.shortDescription,
    visibility: req.body.visibility,
    createdBy: communityId,
    communityRating:communityGettingEvent.commuintyAverageRating,
    // host: req.community.superAdmin[0].id,
  });
  // 2) Update that event into communities resource in events array
  document.eventsIds.push(createdEvent.id);
  await document.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: 'success',
    data: {
      event: createdEvent,
    },
  });
});

exports.getAllEventsForCommunities = catchAsync(async (req, res, next) => {
  const communityId = req.community.id;
  const events = await Community.findById(communityId).select('events');

  res.status(200).json({
    length: events.length,
    status: 'success',
    events,
  });
});

// function for handling getOneEventForCommunity

exports.getOneEventForCommunities = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;
  const event = await Event.findById(eventId);

  res.status(200).json({
    status: 'success',
    data: {
      event,
    },
  });
});

// create booth
exports.createBooth = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const eventId = req.params.eventId;

  // fetch event for which I have to create a booth
  const eventGettingBooth = await Event.findById(eventId);

  // Create a new booth document with recived
  console.log(eventGettingBooth);

  // Create a new booth document with recived req.body info
  const processedObj = fillSocialMediaHandler(req.body.socialMediaHandles);
  const createdBooth = await Booth.create({
    name: req.body.name,
    description: req.body.description,
    boothLogo: req.body.boothLogo,
    boothPoster: req.body.boothPoster,
    socialMediaHandles: processedObj,
    tags: req.body.tags,
  });

  // save refrence of this booth in its event
  eventGettingBooth.booths.push(createdBooth.id);
  await eventGettingBooth.save({ validateModifiedOnly: true });

  // send newly created booth back to client
  res.status(200).json({
    status: 'success',
    data: createdBooth,
  });
});

// add sponsor
exports.addSponsor = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const eventId = req.params.eventId;
  // fetch event for which I have to create a sponsor
  const eventGettingSponsor = await Event.findById(eventId);

  // Create a new sponsor document with recived req.body info
  const processedObj = fillSocialMediaHandler(req.body.socialMediaHandles);
  const createdSponsor = await Sponsor.create({
    name: req.body.name,
    logo: req.body.logo,
    socialMediaHandles: processedObj,
    status: req.body.status,
  });
  // save refrence of this sponsor in its event
  eventGettingSponsor.sponsors.push(createdSponsor.id);
  await eventGettingSponsor.save({ validateModifiedOnly: true });

  // send newly created sponsor back to client
  res.status(200).json({
    status: 'success',
    data: createdSponsor,
  });
});

// add speaker
exports.addSpeaker = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;
  const communityId = req.community._id;
  const sessionsMappedByCommunity = req.body.sessions;
  const eventGettingSpeaker = await Event.findById(eventId);
  const allSessionsInThisEvent = eventGettingSpeaker.session;
  // confirm if this session exist in this event
  const fxn = (allSessionsInThisEvent, sessionsMappedByCommunity) => {
    const processedSessions = [];
    sessionsMappedByCommunity.map((el) => {
      if (allSessionsInThisEvent.includes(el)) {
        processedSessions.push(el);
      }
    });
    return processedSessions;
  };
  const processedArray = fxn(allSessionsInThisEvent, sessionsMappedByCommunity);

  const communityGettingSpeaker = await Community.findById(communityId);
  const speaker = await Speaker.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    sessions: processedArray,
  });

  const document = await SpeakersIdsCommunityWise.findById(
    communityGettingSpeaker.speakersDocIdCommunityWise
  );
  console.log(document);
  document.speakersIds.push(speaker._id);
  eventGettingSpeaker.speaker.push(speaker._id);
  await eventGettingSpeaker.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: 'success',
    data: speaker,
  });
});

// added Sessions
exports.addSession = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;
  // const communityId = req.community._id;
  const speakersMappedByCommunityForSession = req.body.speakers;
  const eventGettingSessions = await Event.findById(eventId);
  const allSpeakersInThisEvent = eventGettingSessions.speaker;

  // confirm if this session exist in this event
  const fxn = (allSpeakersInThisEvent, speakersMappedByCommunityForSession) => {
    const processedSpeakers = [];
    speakersMappedByCommunityForSession.map((el) => {
      if (allSpeakersInThisEvent.includes(el)) {
        processedSpeakers.push(el);
      }
    });
    return processedSpeakers;
  };
  const processedArray = fxn(
    allSpeakersInThisEvent,
    speakersMappedByCommunityForSession
  );
  // console.log(`allSessionsInThisEvent:`, allSessionsInThisEvent);
  // console.log(`sessionsMappedByCommunity:`, sessionsMappedByCommunity);
  // console.log(`processedArray:`, processedArray);

  const session = await Session.create({
    name: req.body.name,
    startDate: req.body.startDate,
    startTime: req.body.startTime,
    description: req.body.description,
    endDate: req.body.endDate,
    endTime: req.body.endTime,
    speaker: processedArray,
  });

  eventGettingSessions.session.push(session._id);
  await eventGettingSessions.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: 'success',
    data: session,
  });
});
//update handler for updating speakers
exports.updateSpeaker = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;
  // const communityId = req.community._id;
  const sessionsMappedByCommunity = req.body.sessions;
  const eventGettingSpeaker = await Event.findById(eventId);
  const allSessionsInThisEvent = eventGettingSpeaker.session;
  const speakerGettingUpdate = req.params.speakerId;
  // confirm if this session exist in this event

  const fxn = (allSessionsInThisEvent, sessionsMappedByCommunity) => {
    const processedSessions = [];
    sessionsMappedByCommunity.map((el) => {
      if (allSessionsInThisEvent.includes(el)) {
        processedSessions.push(el);
      }
    });
    return processedSessions;
  };
  const processedArray = fxn(allSessionsInThisEvent, sessionsMappedByCommunity);

  const updatedSpeaker = await Speaker.findByIdAndUpdate(speakerGettingUpdate, {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    bio: req.body.bio,
    sessions: processedArray,
  });
  console.log(updatedSpeaker);

  res.status(200).json({
    status: 'success',
    data: updatedSpeaker,
  });
});
exports.updateSession = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;
  const sessionGettingUpdate = req.params.sessionId;
  const speakersMappedByCommunity = req.body.speakers;
  const eventGettingSession = await Event.findById(eventId);
  const allSpeakersInThisEvent = eventGettingSession.speaker;

  // confirm if this session exist in this event
  const fxn = (allSpeakersInThisEvent, speakersMappedByCommunity) => {
    const processedSessions = [];
    speakersMappedByCommunity.map((el) => {
      if (allSpeakersInThisEvent.includes(el)) {
        processedSessions.push(el);
      }
    });
    return processedSessions;
  };
  const processedArray = fxn(allSpeakersInThisEvent, speakersMappedByCommunity);

  const updatedSession = await Session.findByIdAndUpdate(sessionGettingUpdate, {
    speaker: processedArray,
  });

  res.status(200).json({
    status: 'success',
    data: updatedSession,
  });
});

///////////////////////////
// && !(AlreadyInSessions.includes(el)
//////////////////////////
