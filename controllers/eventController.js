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
const RegistrationForm = require("./../models/registrationFormModel");

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

exports.createEvent = catchAsync(async (req, res, next) => {
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
    communityName: communityGettingEvent.name,
    organisedBy: communityGettingEvent.name,
    communityId: communityGettingEvent._id,
  });

  // 0) Create a registration form document for this event and store its id in this event
  const registrationForm = await RegistrationForm.create({
    initialisedAt: Date.now(),
    eventId: createdEvent._id,
  });

  createdEvent.registrationFormId = registrationForm._id;

  const newEvent = await createdEvent.save({
    new: true,
    validateModifiedOnly: true,
  });

  // 2) Update that event into communities resource in events array
  document.eventsIds.push(createdEvent.id);
  await document.save({ validateModifiedOnly: true });

  const event = await Event.findById(createdEvent.id).populate(
    "registrationFormId"
  );

  res.status(200).json({
    status: "success",
    data: {
      event: event,
    },
  });
});

exports.getAllEventsForCommunities = catchAsync(async (req, res, next) => {
  const communityId = req.community.id;

  const allEvents = await Event.find({
    createdBy: mongoose.Types.ObjectId(communityId),
  });

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

  const features = new apiFeatures(query, req.query).textFilter().paginate();

  const events = await features.query;

  res.status(200).json({
    length: allEvents.length,
    status: "success",
    events,
  });
});

// function for handling getOneEventForCommunity

exports.getOneEventForCommunities = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;
  const event = await Event.findById(eventId).populate("registrationFormId");

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

  // fetch event for which I have to create a booth
  const eventGettingBooth = await Event.findById(eventId);

  // Create a new booth document with recived

  // Create a new booth document with recived req.body info
  const processedObj = fillSocialMediaHandler(req.body.socialMediaHandles);

  const createdBooth = await Booth.create({
    name: req.body.name,
    emails: req.body.emails,
    tagline: req.body.tagline,
    description: req.body.description,
    image: req.body.image,
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
  const eventId = req.params.eventId;
  const communityId = req.community._id;
  const sessionsMappedByCommunity = req.body.sessions;
  const eventGettingSpeaker = await Event.findById(eventId);
  const allSessionsInThisEvent = eventGettingSpeaker.session;

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

  const communityGettingSpeaker = await Community.findById(communityId);

  const speaker = await Speaker.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    sessions: processedArray,
    bio: req.body.bio,
    organisation: req.body.organisation,
    eventId: eventGettingSpeaker.id,
    image: req.body.image,
  });

  const speakerInvitationLink = `http://localhost:3001/join-as-speaker?role=speaker&id=${speaker._id}&community=${communityId}&event=${eventId}`;
  const speakerDashboardLink = `https://localhost:3001/speaker/dashboard/${speaker._id}`;

  speaker.socialMediaHandles = req.body.socialMediaHandles;
  speaker.invitationLink = speakerInvitationLink;
  speaker.dashboardLink = speakerDashboardLink;

  // 2.) Send new Invitation via mail to speaker
  const msg = {
    to: req.body.email, // Change to your recipient
    from: "shreyanshshah242@gmail.com", // Change to your verified sender
    subject: "Your Event Invitation Link",
    text: `use this link to join this event as a speaker. ${speakerInvitationLink}`,
    // html: TeamInviteTemplate(urlToBeSent, communityDoc, userDoc),
  };

  if (req.body.sendInvitation) {
    sgMail
      .send(msg)
      .then(async () => {
        console.log("Invitation sent to speaker.");
        // Mark that invitation is sent
        speaker.invitationStatus = "Sent";
        await speaker.save({ new: true, validateModifiedOnly: true });
      })
      .catch(async (error) => {
        console.log("Failed to send invitation to speaker");
        // Mark that invitation is not yet sent
        speaker.invitationStatus = "Not sent";
        await speaker.save({ new: true, validateModifiedOnly: true });
      });
  } else {
    speaker.invitationStatus = "Not sent";
    await speaker.save({ new: true, validateModifiedOnly: true });
  }

  const document = await SpeakersIdsCommunityWise.findById(
    communityGettingSpeaker.speakersDocIdCommunityWise
  );

  document.speakersIds.push(speaker._id);
  eventGettingSpeaker.speaker.push(speaker._id);
  await eventGettingSpeaker.save({ validateModifiedOnly: true });

  await speaker.save({ new: true, validateModifiedOnly: true });

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
  const speakersMappedByCommunityForSession = req.body.speakers;
  const eventGettingSessions = await Event.findById(eventId);
  const allSpeakersInThisEvent = eventGettingSessions.speaker;

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

  let session = await Session.create(
    {
      name: req.body.name,
      startDate: req.body.startDate,
      startTime: req.body.startTime,
      description: req.body.description,
      endDate: req.body.endDate,
      endTime: req.body.endTime,
      speaker: processedArray,
      eventId: eventGettingSessions.id,
    }
  );

  session.tags = req.body.tags;

  await session.save({new: true, validateModifiedOnly: true});

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
  const filteredBody = filterObj(
    req.body,
    "whoCanEnterEvent",
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
    "organisedBy",
    "publishedStatus",
    "mailChimpAudienceTag",
    "mailChimpAudienceListIdForRegistrants",
    "mailChimpAudienceListIdForLeads",
    "mailChimpAudienceListIdForInterestedPeople",
    "addDirectAccessLinkToMailChimp",
    "status"
  );

  const eventDoc = await Event.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    validateModifiedOnly: true,
  }).populate("registrationFormId");

  try {
    if (req.body.Timezone) {
      eventDoc.Timezone = req.body.Timezone;
    }
    if (req.body.categories) {
      eventDoc.categories = req.body.categories;
    }

    const updatedEvent = await eventDoc.save({
      new: true,
      validateModifiedOnly: true,
    });

    res.status(200).json({
      status: "success",
      updatedEvent,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      status: "error",
      message: "something was gone wrong. Please try again later!",
    });
  }
});

exports.updateRegistrationForm = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "prefix_enabled",
    "prefix_required",
    "home_phone_enabled",
    "home_phone_required",
    "cell_phone_enabled",
    "cell_phone_required",
    "work_phone_enabled",
    "work_phone_required",
    "home_address_enabled",
    "home_address_required",
    "shiiping_address_enabled",
    "shiiping_address_required",
    "work_address_enabled",
    "work_address_required",
    "gender_enabled",
    "gender_required",
    "website_enabled",
    "website_required"
  );

  const eventDoc = await RegistrationForm.findOneAndUpdate(
    { eventId: req.params.eventId },
    filteredBody,
    {
      new: true,
      validateModifiedOnly: true,
    },
    async (err, data) => {
      const eventId = req.params.eventId;
      const updatedEvent = await Event.findById(eventId).populate(
        "registrationFormId"
      );

      res.status(200).json({
        status: "success",
        data: {
          updatedEvent,
        },
      });
    }
  );
});

exports.updatePromoImage = catchAsync(async (req, res, next) => {
  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id,
    { image: req.body.image },
    { new: true, validateModifiedOnly: true }
  );

  res.status(200).json({
    status: "success",
    updatedEvent: updatedEvent,
  });
});

exports.updateEventDescription = catchAsync(async (req, res, next) => {
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
  const ticketDoc = await Ticket.findById(ticketId);

  const eventUpdatingTicket = await Event.findById(ticketDoc.eventId);

  const previousMinPrice = eventUpdatingTicket.minTicketPrice;
  const previousMaxPrice = eventUpdatingTicket.maxTicketPrice;

  let updatedMinPrice = previousMinPrice;
  let updatedMaxPrice = previousMaxPrice;
  const currentPriceValue = req.body.price;

  if (currentPriceValue < previousMinPrice) {
    updatedMinPrice = currentPriceValue;
  }
  if (currentPriceValue > previousMaxPrice) {
    updatedMaxPrice = currentPriceValue;
  }

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

  await Event.findByIdAndUpdate(ticketDoc.eventId, {
    minTicketPrice: updatedMinPrice,
    maxTicketPrice: updatedMaxPrice,
  });

  res.status(200).json({
    status: "success",
    data: updatedTicket,
  });
});

exports.getAllTickets = catchAsync(async (req, res, next) => {
  let tickets = await Event.findById(req.params.id)
    .select("tickets")
    .populate("tickets");

  tickets = tickets.tickets.filter((ticket) => ticket.status !== "Deleted");

  res.status(200).json({
    status: "Success",
    data: tickets,
  });
});

exports.getOneTicket = catchAsync(async (req, res, next) => {
  let ticket = await Ticket.findById(req.params.id);

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

exports.generateReferralCode = catchAsync(async (req, res, next) => {
  const createdForEvent = req.body.body.eventId;
  const createdForCommunity = req.body.communityId;
  const referralCode = uniqid();

  const createdReferral = await EventReferral.create({
    createdAt: Date.now(),
    expiryTime: req.body.expiryTime,
    expiryDate: req.body.expiryDate,
    referralCode,
    createdForEvent,
    createdForCommunity,
    discount: req.body.discount,
  });

  res.status(200).json({
    status: "SUCCESS",
    data: {
      createdReferral,
    },
  });
});

exports.getAffiliates = catchAsync(async (req, res, next) => {
  const eventAffiliates = await Event.findById(req.params.eventId)
    .select("affiliates")
    .populate("affiliates");

  res.status(200).json({
    status: "success",
    data: eventAffiliates,
  });
});

exports.saveEventbriteConf = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  const { eventbriteOrganisation, eventbriteEvent, eventbriteWebhookData } =
    req.body;

  const updatedEventDoc = Event.findByIdAndUpdate(
    eventId,
    {
      eventbriteOrganisation,
      eventbriteEvent,
      eventbriteWebhookData,
    },
    { new: true, validateModifiedOnly: true }
  );

  res.status(200).json({
    status: "success",
    message: "Successfully saved eventbrite configurations.",
  });
});
