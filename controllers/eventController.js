const Event = require("../models/eventModel");
const Community = require("../models/communityModel");
const EventsIdsCommunityWise = require("../models/eventsIdsCommunityWiseModel");
const Speaker = require("../models/speakerModel");
const SpeakersIdsCommunityWise = require("../models/speakersIdsCommunityWiseModel");
const Booth = require("../models/boothModel");
const Sponsor = require("../models/sponsorModel");
const Session = require("../models/sessionModel");
const EventReferral = require("../models/referralModelForEvent");
const Ticket = require("../models/ticketModel");
const apiFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const validator = require("validator");
const mongoose = require("mongoose");

const uniqid = require("uniqid");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const fillSocialMediaHandler = (object) => {
  const newObj = {};
  for (let key in object) {
    const value = object[key];
    // 2) Check if value is a url
    // 3) if yes then go to next step and fetch only userhandle and then use it to replace old value of key
    // 4) if no then directly use this key value pair and return
    // 5) finally return transformed object having social media keys and corresponding userHandles
    const bool = validator.isURL(value);
    if (bool) {
      // now I have to use regular expression
      switch (key) {
        case "facebook": {
          const regex = /(?<=com\/).+/;
          [newVal] = value.match(regex);
          newObj.facebook = newVal;
          break;
        }
        case "instagram": {
          const regex = /(?<=com\/).+/;
          [newVal] = value.match(regex);
          newObj.instagram = newVal;
          break;
        }
        case "twitter": {
          const regex = /(?<=com\/).+/;
          [newVal] = value.match(regex);
          newObj.twitter = newVal;
          break;
        }
        case "linkedIn": {
          const regex = /(?<=\/in\/).+/;
          [newVal] = value.match(regex);
          newObj.linkedIn = newVal;
          break;
        }
        case "website": {
          const regex = /(?<=www.).+/;
          [newVal] = value.match(regex);
          newObj.website = newVal;
          break;
        }
      }
    } else {
      newObj.set(key, value);
    }
  }
  return newObj;
};

/* eslint-disable no-console */
exports.createEvent = catchAsync(async (req, res, next) => {
  console.log(req.community);
  console.log("op", new Date(req.body.startTime));
  console.log("op 222", new Date(req.body.endTime));

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
    communityRating: communityGettingEvent.commuintyAverageRating,
    categories: req.body.categories,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    startTime: new Date(req.body.startTime),
    endTime: new Date(req.body.endTime),
    socialMediaHandles: communityGettingEvent.socialMediaHandles,
    Timezone: req.body.timezone,
    // host: req.community.superAdmin[0].id,
  });
  // 2) Update that event into communities resource in events array
  document.eventsIds.push(createdEvent.id);
  await document.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    data: {
      event: createdEvent,
    },
  });
});

exports.getAllEventsForCommunities = catchAsync(async (req, res, next) => {
  const communityId = req.community.id;

  const query = Event.find({ createdBy: mongoose.Types.ObjectId(communityId) })
    .populate("sponsors")
    .populate("tickets")
    .populate("booths")
    .populate("session")
    .populate("speaker")
    .populate({
      path: "createdBy",
      select: "name logo socialMediaHandles",
    })
    .populate({
      path: "coupon",
      options: {
        match: { status: "Active" },
      },
    });

  const features = new apiFeatures(query, req.query).textFilter();

  const events = await features.query;

  res.status(200).json({
    length: events.length,
    status: "success",
    events,
  });
});

// function for handling getOneEventForCommunity

exports.getOneEventForCommunities = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;
  const event = await Event.findById(eventId);

  res.status(200).json({
    status: "success",
    data: {
      event,
    },
  });
});

// create booth
exports.createBooth = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const eventId = req.params.id;

  console.log(req.body, "line 149");

  // fetch event for which I have to create a booth
  const eventGettingBooth = await Event.findById(eventId);

  // Create a new booth document with recived
  console.log(eventGettingBooth);

  // Create a new booth document with recived req.body info
  const processedObj = fillSocialMediaHandler(req.body.socialMediaHandles);
  console.log("This is processedObj", processedObj);
  const createdBooth = await Booth.create({
    name: req.body.name,
    emails: req.body.emails,
    tagline: req.body.tagline,
    description: req.body.description,
    image: req.body.image,
    // boothLogo: req.body.boothLogo,
    // boothPoster: req.body.boothPoster,
    socialMediaHandles: processedObj,
    tags: req.body.tags,
    eventId: eventGettingBooth.id,
  });

  // save refrence of this booth in its event
  eventGettingBooth.booths.push(createdBooth.id);
  for (let element of req.body.tags) {
    eventGettingBooth.boothTags.push(element);
  }
  await eventGettingBooth.save({ validateModifiedOnly: true });

  // send newly created booth back to client
  res.status(200).json({
    status: "success",
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
  const createdSponsor = await Sponsor.create({
    organisationName: req.body.organisationName,
    website: req.body.website,
    status: req.body.status,
    eventId: eventGettingSponsor.id,
    image: req.body.image,
  });
  // save refrence of this sponsor in its event
  eventGettingSponsor.sponsors.push(createdSponsor.id);
  await eventGettingSponsor.save({ validateModifiedOnly: true });

  // send newly created sponsor back to client
  res.status(200).json({
    status: "success",
    data: createdSponsor,
  });
});

// add speaker
exports.addSpeaker = catchAsync(async (req, res, next) => {
  console.log(req.body, "Line 233");

  const eventId = req.params.eventId;
  const communityId = req.community._id;
  const sessionsMappedByCommunity = req.body.sessions;
  const eventGettingSpeaker = await Event.findById(eventId);
  const allSessionsInThisEvent = eventGettingSpeaker.session;

  console.log(sessionsMappedByCommunity);

  // const processedObj = fillSocialMediaHandler(req.body.socialMediaHandles);

  // confirm if this session exist in this event

  let processedArray = [];
  const fxn = (allSessionsInThisEvent, sessionsMappedByCommunity) => {
    const processedSessions = [];
    sessionsMappedByCommunity.map((el) => {
      if (allSessionsInThisEvent.includes(el)) {
        processedSessions.push(el);
      }
    });
    return processedSessions;
  };

  if (sessionsMappedByCommunity != undefined) {
    processedArray = fxn(allSessionsInThisEvent, sessionsMappedByCommunity);
  }

  console.log("processedArray", processedArray);

  const communityGettingSpeaker = await Community.findById(communityId);

  const speaker = await Speaker.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    sessions: processedArray,
    headline: req.body.headline,
    organisation: req.body.organisation,
    eventId: eventGettingSpeaker.id,
    // socialMediaHandles: processedObj,
    image: req.body.image,
  });

  console.log(speaker, "277");

  speakerLink = `http://localhost:3001/community/${communityId}/event/${eventId}/hosting-platform/lobby?role=speaker&id=${speaker._id}`;

  // 2.) Send new Invitation via mail to speaker
  const msg = {
    to: req.body.email, // Change to your recipient
    from: "shreyanshshah242@gmail.com", // Change to your verified sender
    subject: "Your Event Invitation Link",
    text: `use this link to join this event as a speaker. ${speakerLink}  `,
    // html: TeamInviteTemplate(urlToBeSent, communityDoc, userDoc),
  };

  sgMail
    .send(msg)
    .then(async () => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });

  const document = await SpeakersIdsCommunityWise.findById(
    communityGettingSpeaker.speakersDocIdCommunityWise
  );
  console.log(document);
  document.speakersIds.push(speaker._id);
  eventGettingSpeaker.speaker.push(speaker._id);
  await eventGettingSpeaker.save({ validateModifiedOnly: true });

  const populatedSpeaker = await Speaker.findById(speaker.id).populate(
    "sessions"
  );

  res.status(200).json({
    status: "success",
    data: populatedSpeaker,
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

  let processedArray = [];
  const fxn = (allSpeakersInThisEvent, speakersMappedByCommunityForSession) => {
    const processedSpeakers = [];
    speakersMappedByCommunityForSession.map((el) => {
      if (allSpeakersInThisEvent.includes(el)) {
        processedSpeakers.push(el);
      }
    });
    return processedSpeakers;
  };
  if (speakersMappedByCommunityForSession != undefined) {
    processedArray = fxn(
      allSpeakersInThisEvent,
      speakersMappedByCommunityForSession
    );
  }
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
    eventId: eventGettingSessions.id,
  });

  const populatedSession = await Session.findById(session.id).populate(
    "speaker"
  );

  eventGettingSessions.session.push(session._id);
  await eventGettingSessions.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    data: populatedSession,
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
  const processedArray = [];

  const fxn = (allSessionsInThisEvent, sessionsMappedByCommunity) => {
    const processedSessions = [];
    sessionsMappedByCommunity.map((el) => {
      if (allSessionsInThisEvent.includes(el)) {
        processedSessions.push(el);
      }
    });
    return processedSessions;
  };
  if (sessionsMappedByCommunity != undefined) {
    processedArray = fxn(allSessionsInThisEvent, sessionsMappedByCommunity);
  }

  const updatedSpeaker = await Speaker.findByIdAndUpdate(speakerGettingUpdate, {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    bio: req.body.bio,
    sessions: processedArray,
  });
  console.log(updatedSpeaker);

  res.status(200).json({
    status: "success",
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
  const processedArray = [];

  const fxn = (allSpeakersInThisEvent, speakersMappedByCommunity) => {
    const processedSessions = [];
    speakersMappedByCommunity.map((el) => {
      if (allSpeakersInThisEvent.includes(el)) {
        processedSessions.push(el);
      }
    });
    return processedSessions;
  };
  if (speakersMappedByCommunity != undefined) {
    processedArray = fxn(allSpeakersInThisEvent, speakersMappedByCommunity);
  }

  const updatedSession = await Session.findByIdAndUpdate(sessionGettingUpdate, {
    speaker: processedArray,
  });

  res.status(200).json({
    status: "success",
    data: updatedSession,
  });
});

exports.createTicket = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;
  const eventGettingNewTicket = await Event.findById(eventId);
  const previousMinPrice = eventGettingNewTicket.minTicketPrice;
  const previousMaxPrice = eventGettingNewTicket.maxTicketPrice;

  let updatedMinPrice = previousMinPrice;
  let updatedMaxPrice = previousMaxPrice;
  const currentPriceValue = req.body.price;

  if (currentPriceValue < previousMinPrice) {
    updatedMinPrice = currentPriceValue;
  }
  if (currentPriceValue > previousMaxPrice) {
    updatedMaxPrice = currentPriceValue;
  }

  // Create a new Ticket Document in Ticket collection
  const newlyCreatedTicket = await Ticket.create({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    numberOfTicketAvailable: req.body.numberOfTicketAvailable,
    currency: req.body.currency,
    shareRecording: req.body.shareRecording,
    venueAreasAccessible: req.body.venueAreasAccessible,
    initiatedAt: Date.now(),
    eventId: eventGettingNewTicket.id,
  });

  eventGettingNewTicket.tickets.push(newlyCreatedTicket.id);
  await eventGettingNewTicket.save({ validateModifiedOnly: true });
  await Event.findByIdAndUpdate(eventId, {
    minTicketPrice: updatedMinPrice,
    maxTicketPrice: updatedMaxPrice,
  });

  // Update corresponsing event document with newly created ticket objectId and set new values for min and max ticket price
  res.status(201).json({
    status: "success",
    message: "New Ticket Created Successfully",
    data: newlyCreatedTicket,
  });
});

///////////////////////////
// && !(AlreadyInSessions.includes(el)
//////////////////////////
exports.updateEvent = catchAsync(async (req, res, next) => {
  console.log(req.body, 435);
  const filteredBody = filterObj(
    req.body,
    "eventName",
    "shortDescription",
    "startDate",
    "startTime",
    "endDate",
    "endTime",
    "selectTimeZone",
    "selectCategories",
    "visibility",
    "editingComment",
    "image",
    "publishedStatus"
  );

  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      validateModifiedOnly: true,
    }
  );

  res.status(200).json({
    status: "success",
    updatedEvent,
  });
});

exports.updateEventDescription = catchAsync(async (req, res, next) => {
  console.log(req.body.editingComment);

  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id,
    { editingComment: JSON.stringify(req.body.editingComment) },
    {
      new: true,
      validateModifiedOnly: true,
    }
  );

  res.status(200).json({
    status: "success",
    updatedEvent,
  });
});

exports.getNetworkSettings = catchAsync(async (req, res, next) => {
  const eventId = req.params.id;

  const settings = await Event.findById(eventId).select("networkingSettings");

  res.status(200).json({
    status: "success",
    data: settings,
  });
});

exports.updateTicket = catchAsync(async (req, res, next) => {
  const ticketId = req.params.id;

  console.log(ticketId);

  const updatedTicket = await Ticket.findByIdAndUpdate(
    ticketId,
    {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      numberOfTicketAvailable: req.body.numberOfTicketAvailable,
      currency: req.body.currency,
      shareRecording: req.body.shareRecording,
      venueAreasAccessible: req.body.venueAreasAccessible,
    },
    { new: true, validateModifiedOnly: true }
  );

  console.log(updatedTicket);

  res.status(200).json({
    status: "success",
    data: updatedTicket,
  });
});

exports.getAllTickets = catchAsync(async (req, res, next) => {
  let tickets = await Event.findById(req.params.id)
    .select("tickets")
    .populate("tickets");
  console.log(tickets);

  tickets = tickets.tickets.filter((ticket) => ticket.status !== "Deleted");

  res.status(200).json({
    status: "Success",
    data: tickets,
  });
});

exports.getOneTicket = catchAsync(async (req, res, next) => {
  let ticket = await Ticket.findById(req.params.id);
  console.log(ticket);

  res.status(200).json({
    status: "Success",
    data: ticket,
  });
});

exports.deleteTicket = catchAsync(async (req, res, next) => {
  let deletedTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    { status: "Deleted" },
    { new: true, validateModifiedOnly: true }
  );

  const id = deletedTicket.id;

  res.status(200).json({
    status: "Success",
    data: id,
  });
});

exports.updateNetworking = catchAsync(async (req, res, next) => {
  const eventId = req.params.id;

  const updatedSettings = await Event.findByIdAndUpdate(
    eventId,
    {
      networkingSettings: req.body.networkingSettings,
    },
    { new: true, validateModifiedOnly: true }
  ).select("networkingSettings");

  res.status(200).json({
    status: "success",
    data: updatedSettings,
  });
});


exports.generateReferralCode =catchAsaync(async(req,res,next)=>{

     
const  referralCode =uniqid();




}
)