const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");
const Event = require("../models/eventModel");
const Registration = require("./../models/registrationsModel");
const Session = require("./../models/sessionModel");
const Booth = require("./../models/boothModel");
const EventChatMessage = require("./../models/eventChatMessageModel");
const NetworkingRoom = require("./../models/networkingRoomModel");
const SessionPoll = require("./../models/sessionPollModel");
const SessionQnA = require("./../models/sessionQnAModel");
const EventAlert = require("./../models/eventAlertsModel");
const SharedBusinessCard = require("../models/sharedBusinessCard");
const Review = require("../models/reviewModel");
const BoothChats = require("./../models/boothChatsModel");
const SessionChatMessage = require("./../models/sessionChatMessageModel");

exports.generateEventSummaryReport = catchAsync(async (req, res, next) => {
  try {
    const eventId = req.params.eventId;

    const eventDoc = await Event.findById(eventId);

    const registrations = await Registration.find({
      $and: [
        { bookedForEventId: mongoose.Types.ObjectId(eventId) },
        { type: "Attendee" },
      ],
    });

    // 2. Calculate event turnout

    // Approach => turnout = (totalEventVisitors / registrations )* 100

    let turnout = (eventDoc.attendedBy.length / registrations.length) * 100;

    // 3. Total ticket sales

    let ticketSales = eventDoc.netSales; // Total sales amount in USD

    // 4. Total chats in event

    const eventChats = await EventChatMessage.find({
      eventId: mongoose.Types.ObjectId(eventId),
    });

    const totalMessages = eventChats.length;

    // 5. Total session visitors

    const sessions = await Session.find({
      eventId: mongoose.Types.ObjectId(eventId),
    });

    let totalSessionVisitors = 0;

    for (let element of sessions) {
      totalSessionVisitors = totalSessionVisitors + element.attendedBy.length;
    }

    // 6. Total Lounge Visitors

    let totalLoungeVisits = eventDoc.loungeAttendedBy.length;

    // 7. Total Networking Visits

    let totalNetworkingVisits = eventDoc.networkingAttendedBy.length;

    // 8. Total Expo Visits

    const booths = await Booth.find({
      eventId: mongoose.Types.ObjectId(eventId),
    });

    let totalExpoVisits = 0;

    for (let element of booths) {
      totalExpoVisits = totalExpoVisits + element.attendedBy.length;
    }

    // 9. Total connections made

    const networkingRooms = await NetworkingRoom.find({
      eventId: mongoose.Types.ObjectId(eventId),
    });

    let connectionsMade = networkingRooms.length;

    // 10. Total countries represented

    let countriesRepresented = 0;

    if (eventDoc.countries) {
      countriesRepresented = eventDoc.countries.size;
    }

    res.status(200).json({
      status: "success",
      eventName: eventDoc.eventName,
      registrations: registrations.length,
      turnout: turnout,
      sales: ticketSales,
      chats: totalMessages,
      sessionVisitors: totalSessionVisitors,
      loungeVisitors: totalLoungeVisits,
      networkingVisitors: totalNetworkingVisits,
      boothVisitors: totalExpoVisits,
      connectionsMade: connectionsMade,
      countries: countriesRepresented,
      data: [
        [
          eventDoc.eventName,
          registrations.length,
          turnout,
          ticketSales,
          totalMessages,
          totalSessionVisitors,
          totalLoungeVisits,
          totalNetworkingVisits,
          totalExpoVisits,
          connectionsMade,
          countriesRepresented,
        ],
      ],
    });
  } catch (error) {
    console.log(error);
  }
});

exports.generateEventAttendenceReport = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  const eventDoc = await Event.findById(eventId).populate(
    "attendedBy",
    "firstName lastName email phoneNumber city country organisation designation"
  );

  res.status(200).json({
    status: "success",
    data: eventDoc.attendedBy,
    eventName: eventDoc.eventName,
  });
});

exports.generateSessionAttendenceReport = catchAsync(async (req, res, next) => {
  try {
    const sessions = req.body.sessions;

    const sessionIds = sessions.map((el) => el.value);

    console.log(sessionIds);

    const attendenceArray = [];

    for (let element of sessionIds) {
      const sessionDoc = await Session.findById(element).populate(
        "attendedBy",
        "firstName lastName email phoneNumber city country organisation designation"
      );
      attendenceArray.push({
        sessionName: sessionDoc.name,
        data: sessionDoc.attendedBy,
      });
    }

    res.status(200).json({
      status: "success",
      data: attendenceArray,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.generateBoothAttendenceReport = catchAsync(async (req, res, next) => {
  try {
    const booths = req.body.booths;

    const boothIds = booths.map((el) => el.value);

    console.log(boothIds);

    const attendenceArray = [];

    for (let element of boothIds) {
      const boothDoc = await Booth.findById(element).populate(
        "attendedBy",
        "firstName lastName email phoneNumber city country organisation designation"
      );
      attendenceArray.push({
        boothName: boothDoc.name,
        data: boothDoc.attendedBy,
      });
    }

    res.status(200).json({
      status: "success",
      data: attendenceArray,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.generateScheduleReport = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  const eventDoc = await Event.findById(eventId);

  const sessions = await Session.find({
    eventId: mongoose.Types.ObjectId(eventId),
  })
    .populate("host", "firstName lastName email")
    .populate("speaker", "firstName lastName email")
    .populate("tracks", "name");

  res.status(200).json({
    status: "success",
    data: sessions,
    eventName: eventDoc.eventName,
  });
});

exports.generatePollReport = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  const sessions = req.body.sessions;

  const eventDoc = await Event.findById(eventId);

  const sessionIds = sessions.map((el) => el.value);

  let polls = [];

  for (let element of sessionIds) {
    const sessionDoc = await Session.findById(element);
    const pollDoc = await SessionPoll.find({
      sessionId: mongoose.Types.ObjectId(element),
    });
    polls.push({ sessionName: sessionDoc.name, data: pollDoc });
  }

  res.status(200).json({
    status: "success",
    data: polls,
  });
});

exports.generateQnAReport = catchAsync(async (req, res, next) => {
  try {
    const eventId = req.params.eventId;

    const sessions = req.body.sessions;

    const eventDoc = await Event.findById(eventId);

    const sessionIds = sessions.map((el) => el.value);

    let qnas = [];

    for (let element of sessionIds) {
      const sessionDoc = await Session.findById(element);
      const qnaDocs = await SessionQnA.find({
        sessionId: mongoose.Types.ObjectId(element),
      })
        .populate("askedBy", "firstName")
        .populate("answeredBy", "firstName");

      let formattedQnAs = [];

      for (let item of qnaDocs) {
        console.log(item);

        let newQnA = {};

        newQnA.question = item.question ? item.question : "---";
        newQnA.answer = item.answer ? item.answer : "---";
        newQnA.upvotes = item.upvotes ? item.upvotes : 0;
        newQnA.askedAt = item.createdAt;
        newQnA.askedBy = item.askedBy.firstName
          ? item.askedBy.firstName
          : "---";
        newQnA.answeredBy = item.answeredBy ? item.answeredBy.firstName : "---";

        formattedQnAs.push(newQnA);
      }

      qnas.push({ sessionName: sessionDoc.name, data: formattedQnAs });
    }

    res.status(200).json({
      status: "success",
      data: qnas,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.generateNetworkingReport = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  const eventDoc = await Event.findById(eventId);

  //   NetworkingRoom

  const networkingRooms = await NetworkingRoom.find({
    eventId: mongoose.Types.ObjectId(eventId),
  })
    .populate("joinedByUsers", "firstName lastName email")
    .populate("matchedUsers", "firstName lastName email");

  let formattedRooms = [];

  for (let item of networkingRooms) {
    let newRoom = {};

    newRoom.connectedAt = item.createdAt;
    newRoom.person1 = `${item.matchedUsers[0].firstName} ${item.matchedUsers[0].lastName} ${item.matchedUsers[0].email}`;
    newRoom.person2 = `${item.matchedUsers[1].firstName} ${item.matchedUsers[1].lastName} ${item.matchedUsers[1].email}`;

    formattedRooms.push(newRoom);
  }

  res.status(200).json({
    status: "success",
    data: formattedRooms,
    eventName: eventDoc.eventName,
  });
});

exports.generateEventChatReport = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  const eventDoc = await Event.findById(eventId);

  const eventChats = await EventChatMessage.find({
    eventId: mongoose.Types.ObjectId(eventId),
  });

  res.status(200).json({
    status: "success",
    eventName: eventDoc.eventName,
    data: eventChats,
  });
});

exports.generateSessionChatReport = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  const eventDoc = await Event.findById(eventId);

  const sessions = req.body.sessions;

  const sessionIds = sessions.map((el) => el.value);

  let allChats = [];

  for (let element of sessionIds) {
    const sessionDoc = await Session.findById(element);
    const sessionChats = await SessionChatMessage.find({
      sessionId: mongoose.Types.ObjectId(element),
    });
    allChats.push({ sessionName: sessionDoc.name, data: sessionChats });
  }

  res.status(200).json({
    status: "success",
    data: allChats,
  });
});

exports.generateBoothChatReport = catchAsync(async (req, res, next) => {
  try {
    const eventId = req.params.eventId;

    const eventDoc = await Event.findById(eventId);

    const booths = req.body.booths;

    const boothIds = booths.map((el) => el.value);

    let allChats = [];

    for (let element of boothIds) {
      const boothDoc = await Booth.findById(element);
      const boothChats = await BoothChats.find({
        boothId: mongoose.Types.ObjectId(element),
      });
      allChats.push({ boothName: boothDoc.name, data: boothChats });
    }

    res.status(200).json({
      status: "success",
      data: allChats,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.generateRegisteredUsersReport = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  const eventDoc = await Event.findById(eventId);

  const registrations = await Registration.find({
    $and: [
      { bookedForEventId: mongoose.Types.ObjectId(eventId) },
      { type: "Attendee" },
    ],
  });

  res.status(200).json({
    status: "success",
    data: registrations,
    eventName: eventDoc.eventName,
  });
});

exports.generateViewershipCountReport = catchAsync(async (req, res, next) => {
  // ! We have to write body for this function as well

  const eventId = req.params.eventId;

  const eventDoc = await Event.findById(eventId);

  res.status(200).json({
    status: "success",
  });
});

exports.generateAttendeeScoreReport = catchAsync(async (req, res, next) => {

  try{
    const eventId = req.params.eventId;

    const eventDoc = await Event.findById(eventId);
  
    const reviews = await Review.find({
      eventId: mongoose.Types.ObjectId(eventId),
    }).populate("user", "firstName lastName email");
  
    let formattedReviews = [];
  
    for (let element of reviews) {
      let newReview = {};
      newReview.userFirstName = element.user.firstName;
      newReview.userLastName = element.user.lastName;
      newReview.userEmail = element.user.email;
      newReview.createdAt = element.createdAt;
      newReview.eventName = eventDoc.eventName;
  
      newReview.score = element.rating;
      newReview.comment = element.reviewComment;
  
      formattedReviews.push(newReview);
    }
  
    res.status(200).json({
      status: "success",
      data: formattedReviews,
      eventName: eventDoc.eventName,
    });
  }
  catch(error) {
    console.log(error);
  }


});

exports.generateSharedBusinessCardReport = catchAsync(
  async (req, res, next) => {

    try {
      const eventId = req.params.eventId;

      const eventDoc = await Event.findById(eventId);
  
      const booths = req.body.booths;
  
      const boothIds = booths.map((el) => el.value);
  
      let allBusinessCards = [];
  
      for (let element of boothIds) {
        const boothDoc = await Booth.findById(element);
        const businessCards = await SharedBusinessCard.find({
          boothId: mongoose.Types.ObjectId(element),
        }).populate(
          "userId",
          "firstName lastName email phoneNumber city country organisation designation"
        );
  
        let formattedCards = [];
  
        for (let item of businessCards) {
          let newCard = {};
          newCard.firstName = item.userId.firstName;
          newCard.lastName = item.userId.lastName;
          newCard.email = item.userId.email ? item.userId.email : "---";
          newCard.phoneNumber = item.userId.phoneNumber
            ? item.userId.phoneNumber
            : "---";
          newCard.city = item.userId.city ? item.userId.city : "---";
          newCard.country = item.userId.country ? item.userId.country : "---";
          newCard.organisation = item.userId.organisation
            ? item.userId.organisation
            : "---";
          newCard.designation = item.userId.designation
            ? item.userId.designation
            : "---";
          newCard.sharedAt = item.timestamp;
  
          formattedCards.push(newCard);
        }
  
        allBusinessCards.push({ boothName: boothDoc.name, data: formattedCards });
      }
  
      res.status(200).json({
        status: "success",
        data: allBusinessCards,
      });
    }
    catch(error) {
      console.log(error);
    }

    
  }
);

exports.generateEventAlertReport = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  const eventDoc = await Event.findById(eventId);

  const alerts = await EventAlert.find({
    eventId: mongoose.Types.ObjectId(eventId),
  });

  res.status(200).json({
    status: "success",
    alerts: alerts,
    eventName: eventDoc.eventName,
  });
});

exports.generateDemographicReport = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  const eventDoc = await Event.findById(eventId);

  res.status(200).json({
    status: "success",
    countries: eventDoc.countries,
    eventName: eventDoc.eventName,
  });
});
