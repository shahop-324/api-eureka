/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

const catchAsync = require("../utils/catchAsync");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const Community = require("../models/communityModel");
const CommunityMailList = require("../models/communityMailListModel");
const User = require("../models/userModel");
const Event = require("../models/eventModel");
const Registration = require("../models/registrationsModel");
const Review = require("../models/reviewModel");
const Query = require("../models/queriesModel");
const QueriesIdsCommunityWise = require("../models/queryIdsCommunityWiseModel");
const EventsIdsCommunityWise = require("../models/eventsIdsCommunityWiseModel");
const ReviewsIdsCommunityWise = require("../models/reviewsIdsCommunityWise");
const SpeakersIdsCommunityWise = require("../models/speakersIdsCommunityWiseModel");
const RegistrationsIdsCommunityWise = require("../models/registrationsIdsCommunityWiseModel");
const Ticket = require("../models/ticketModel");
const Mailer = require("../services/Mailer");
const ForgotPasswordTemplate = require("../services/email/ForgotPasswordTemplate");
const sgMail = require("@sendgrid/mail");
const UUID = require("uuid/v4");
const EventTransactionIdsCommunityWise = require("../models/eventTransactionIdsCommunityWise");
sgMail.setApiKey(process.env.SENDGRID_KEY);

const signTokenForCommunityLogin = (userId, communityId) =>
  jwt.sign(
    { userId: userId, communityId: communityId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
const createSendTokenForCommunityLogin = async (
  userId,
  communityId,
  statusCode,
  communityDoc,
  res
) => {
  const token = signTokenForCommunityLogin(userId, communityId);

  res.status(statusCode).json({
    status: "success",
    token,
    communityDoc,
  });
};
exports.getAllPersonalData = catchAsync(async (req, res, next) => {
  // const personalData = await User.findById(id)
  // const personalData = await User.findById(id)
  const personalData = await User.findById(req.user.id)
    .populate("communities")
    .populate({
      path: "registeredInEvents",
      populate: {
        path: "speaker tickets coupon sponsors session booths",
      },
    });
  res.status(200).json({
    status: "SUCCESSS",
    data: {
      personalData,
    },
  });
});
// exports.getAllRegisteredEvents=catchAsync(async(req,res,next)=>{

//   const registeredInEventsList=await User.findById(req.user.id).select('registeredInEvents').populate('registeredInEvents')
//   res.status(200).json({
// status:"SUCCESSS",
// data:{

//   registeredInEventsList
// }

//   })

// }
// )
// .populate({path: 'spells', options: { sort: [['damages', 'asc']] }})
// Post.find().sort(['updatedAt', 1]);
exports.getParticularEvent = catchAsync(async (req, res) => {
  console.log(req.user);

  const response = await Event.findById(req.params.id, (err, data) => {
    console.log(data, "89");
  })
    .populate({
      path: "tickets",
      options: {
        sort: ["price"],
      },
    })
    .populate("sponsors")
    .populate("booths")
    .populate({
      path: "session",
      populate: {
        path: "speaker",
      },
    })
    .populate("speaker")
    .populate({
      path: "createdBy",
      select: "name socialMediaHandles image email",
    })
    .populate({
      path: "coupon",
      options: {
        match: { status: "Active" },
      },
    });
  console.log(response, "114");

  await Event.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true, validateModifiedOnly: true }
  );

  res.status(200).json({
    status: "SUCCESS",
    data: {
      response,
    },
  });
});

const fillSocialMediaHandler = (object, updatedUser) => {
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
          console.log(updatedUser.socialMediaHandles);
          updatedUser.socialMediaHandles.set(key, newVal);
          break;
        }
        case "instagram": {
          const regex = /(?<=com\/).+/;
          [newVal] = value.match(regex);
          updatedUser.socialMediaHandles.set(key, newVal);
          break;
        }
        case "twitter": {
          const regex = /(?<=com\/).+/;
          [newVal] = value.match(regex);
          updatedUser.socialMediaHandles.set(key, newVal);
          break;
        }
        case "linkedIn": {
          const regex = /(?<=\/in\/).+/;
          [newVal] = value.match(regex);
          updatedUser.socialMediaHandles.set(key, newVal);
          break;
        }
        case "website": {
          const regex = /(?<=www.).+/;
          [newVal] = value.match(regex);
          updatedUser.socialMediaHandles.set(key, newVal);
          break;
        }
      }
    } else {
      updatedUser.socialMediaHandles.set(key, value);
    }
  }
  return updatedUser;
};
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.generalIntent = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "whatAreYouPlanningToDo",
    "interests"
  );

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.profileCompletion = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const filteredBody = filterObj(req.body, "headline", "photo", "gender");

  const updatedUser = await User.findByIdAndUpdate(userId, filteredBody, {
    new: true,
    runValidators: true,
  });
  updatedUser.socialMediaHandles = {};
  //i am going to create one function which takes obj and  updatedUser and we get  from req.body.socialMediaHandles and pass into function

  //create function let say fillSocialMediaHandler
  fillSocialMediaHandler(req.body.socialMediaHandles, updatedUser);
  const doublyUpdatedUser = await updatedUser.save({
    validateModifiedOnly: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: doublyUpdatedUser,
    },
  });
});

exports.updateCommunity = catchAsync(async (req, res) => {
  const communityId = req.community.id;
  // const filteredBody = filterObj(req.body, "headline", "photo", "gender");

  // const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
  //   new: true,
  //   runValidators: true,
  // });
  const communityGettingUpdate = await Community.findById(communityId);
  console.log(communityGettingUpdate);
  //i am going to create one function which takes obj and  updatedUser and we get  from req.body.socialMediaHandles and pass into function

  //create function let say fillSocialMediaHandler
  communityGettingUpdate.socialMediaHandles = {};
  fillSocialMediaHandler(req.body.socialMediaHandles, communityGettingUpdate);
  const doublyUpdatedUser = await communityGettingUpdate.save({
    validateModifiedOnly: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: doublyUpdatedUser,
    },
  });
});

exports.DoesTicketBelongToThisEvent = catchAsync(async (req, res, next) => {
  const ticketId = req.params.ticketId;
  const eventGettingRegistration = await Event.findById(req.params.eventId);

  const bool = eventGettingRegistration.tickets.includes(ticketId);

  if (bool) {
    next();
  } else {
    return next(
      new AppError(
        `Sorry, this ticket does not belong to this event you are trying to register for.`,
        400
      )
    );
  }
});

exports.registerInAnEvent = catchAsync(async (req, res, next) => {
  // Handled Firstly we need to check if user is already registered in this event he is trying to register for if so then return an error saying already registered

  // if(req.body.referralCode)
  // {
  //       await

  // }

  const ticketId = req.params.ticketId;
  const ticketWhichIsBeingUtilised = await Ticket.findById(ticketId);
  const eventGettingRegistration = await Event.findById(req.params.eventId);
  const userWhoIsRegistering = await User.findById(req.user.id);
  const communityGettingRegistration = await Community.findById(
    eventGettingRegistration.createdBy
  );

  const amountOfTicketAvailable =
    ticketWhichIsBeingUtilised.amountOfTicketAvailable;
  const numberOfTicketSoldPreviously =
    ticketWhichIsBeingUtilised.numberOfTicketSold;
  let ticketIsSoldOut = ticketWhichIsBeingUtilised.ticketIsSoldOut;

  if (numberOfTicketSoldPreviously + 1 == amountOfTicketAvailable) {
    ticketIsSoldOut = true;
  }

  const updatedNumOfTicketSold = numberOfTicketSoldPreviously + 1;

  const xahs = await Ticket.findByIdAndUpdate(
    ticketId,
    {
      numberOfTicketSold: updatedNumOfTicketSold,
      ticketIsSoldOut: ticketIsSoldOut,
    },
    { new: true }
  );

  console.log(xahs);

  // create a new registration for that event and update corresponding user, event and community document

  // Update corresponding ticket that its amount avaliable is reduced by 1 and also update if ticket is sold out

  // console.log(communityGettingRegistration);
  // const { analytics } = communityGettingRegistrations;
  // console.log(analytics);

  const communityId = eventGettingRegistration.createdBy;
  console.log(communityId);
  const numberOfRegistrationsReceived = await Event.findOneAndUpdate(
    { _id: req.params.eventId },
    {
      $inc: {
        numberOfRegistrationsReceived: 1,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  console.log(numberOfRegistrationsReceived);
  const x = await Community.findOneAndUpdate(
    { _id: communityId },
    {
      $inc: {
        "analytics.totalRegistrations": 1,
        "analytics.totalRegistrationsThisMonth": 1,
        "analytics.totalRegistrationsThisDay": 1,
        "analytics.totalRegistrationsThisYear": 1,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  console.log(x);

  // communityGettingRegistration.analytics.totalRegistrations += 1;

  // communityGettingRegistration.analytics.totalRegistrationsThisMonth += 1;
  // communityGettingRegistration.analytics.totalRegistrationsThisDay += 1;
  // communityGettingRegistration.analytics.totalRegistrationsThisYear += 1;
  const registrationsDocId =
    communityGettingRegistration.registrationsDocIdCommunityWise;

  // Create a New document in Registration Model
  const newRegistration = await Registration.create({
    eventName: eventGettingRegistration.eventName,
    name: `${userWhoIsRegistering.firstName} ${userWhoIsRegistering.lastName}`,
    photo: userWhoIsRegistering.photo,
    email: userWhoIsRegistering.email,
    bookedByUser: req.user.id,
    bookedForEventId: req.params.eventId,
    eventByCommunityId: eventGettingRegistration.createdBy,
    ticketId: ticketId,
  });

  // Update corresponding event document with current registartion by adding its ObjectId into registrations array
  eventGettingRegistration.registrations.push(newRegistration.id);

  eventGettingRegistration.save({ validateModifiedOnly: true });

  // communityGettingRegistration.save({ validateModifiedOnly: true });
  // Update Corresponding Community with this Registration by adding its ObjectId into registrations array
  const document = await RegistrationsIdsCommunityWise.findById(
    registrationsDocId
  );
  console.log(document);
  document.registrationsId.push(newRegistration.id);
  await document.save({ validateModifiedOnly: true });

  // Update currently loggedIn User's document with current registartion by adding its ObjectId into registration array
  userWhoIsRegistering.registredInEvents.push(req.params.eventId);
  await userWhoIsRegistering.save({ validateModifiedOnly: true });
  // await userWhoIsRegistering.save({ validateModifiedOnly: true });

  // Send newly created registration as response and a message saying resigtration successful.
  res.status(201).json({
    status: "success",
    message: "User is successfully registered in this event.",
    data: {
      user: req.user.id,
      eventInWhichRegistered: req.params.eventId,
      communityGettingRegistration: eventGettingRegistration.createdBy,
      registration: newRegistration,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const eventId = req.params.eventId;

  const userCreatingReview = await User.findById(userId);
  const eventGettingReview = await Event.findById(eventId);
  const eventPreviousRating = eventGettingReview.eventAverageRating;
  const eventPreviousNumOfRatings = eventGettingReview.numberOfRatingsReceived;
  const communityId = eventGettingReview.createdBy;
  const communityGettingReview = await Community.findById(communityId);
  const communityPreviousRating = communityGettingReview.commuintyAverageRating;
  const communityPreviousNumOfRatings = communityGettingReview.numberOfRating;
  const document = await ReviewsIdsCommunityWise.findById(
    communityGettingReview.reviewsDocIdCommunityWise
  );

  const newAvgRatingForCommunity =
    (communityPreviousRating * communityPreviousNumOfRatings +
      req.body.rating) /
    (communityPreviousNumOfRatings + 1);
  const newNumOfRtingsForCommunity = communityPreviousNumOfRatings + 1;

  const newAvgRatingForEvent =
    (eventPreviousRating * eventPreviousNumOfRatings + req.body.rating) /
    (eventPreviousNumOfRatings + 1);
  const newNumofRatingsForEvent = eventPreviousNumOfRatings + 1;

  // 1) Create a new review document
  const newReview = await Review.create({
    createdForEvent: req.params.eventId,
    createdByUser: req.user.id,
    userName: `${userCreatingReview.firstName} ${userCreatingReview.lastName}`,
    userImg: userCreatingReview.photo,
    rating: req.body.rating,
    reviewComment: req.body.reviewComment,
  });

  // 2) Update corresponding event document for which review is created
  console.log(newAvgRatingForEvent);
  await Event.findByIdAndUpdate(eventId, {
    eventAverageRating: newAvgRatingForEvent,
    numberOfRatingsReceived: newNumofRatingsForEvent,
  });
  eventGettingReview.eventAverageRating = newAvgRatingForEvent;
  eventGettingReview.numberOfRatingsReceived = newNumofRatingsForEvent;
  eventGettingReview.reviews.push(newReview.id);
  await eventGettingReview.save({ validateModifiedOnly: true });

  // 3) Update corresponding community document to which this event belongs for which review was given by user
  communityGettingReview.commuintyAverageRating = newAvgRatingForCommunity;
  communityGettingReview.numberOfRatingsRecieved = newNumOfRtingsForCommunity;
  await communityGettingReview.save({ validateModifiedOnly: true });
  document.reviewsIds.push(newReview.id);
  await document.save({ validateModifiedOnly: true });

  // 4) Update corresponding user document with this newly created review documents ObjectId.
  userCreatingReview.reviews.push(newReview.id);
  await userCreatingReview.save({ validateModifiedOnly: true });

  // 5) Send newly created review document back to user
  res.status(201).json({
    status: "success",
    data: newReview,
  });
});

exports.createQuery = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const eventId = req.body.createdForEventId;
  const userCreatingQuery = await User.findById(userId);
  const eventGettingQuery = await Event.findById(eventId);
  const communityGettingQuery = await Community.findById(
    eventGettingQuery.createdBy
  );
  const document = await QueriesIdsCommunityWise.findById(
    communityGettingQuery.queriesDocIdCommunityWise
  );

  // 1) Create a query and mark that query as userIs : 'Registred'
  const createdQuery = await Query.create({
    createdBy: userId,
    userName: req.body.userName,
    userImg: req.body.userImg,
    // userIs: 'Registred or Unregistred', // This field will be set in next step of this middleware stack
    createdForEventId: eventId,
    createdForCommunityId: communityGettingQuery.id,
    createdForEvent: eventGettingQuery.eventName,
    questionText: req.body.questionText,
  });

  // 2) set newly created query document on req object in order to forward it to next middleware in this stack
  req.query = createdQuery;

  // 3) Update corresponding event, community and user documents with the ObjectId of newly created query document
  eventGettingQuery.queries.push(createdQuery.id);
  await eventGettingQuery.save({ validateModifiedOnly: true });

  document.queriesIds.push(createdQuery.id);
  await document.save({
    validateModifiedOnly: true,
  });

  userCreatingQuery.queries.push(createdQuery.id);
  await userCreatingQuery.save({ validateModifiedOnly: true });

  // 4) Call next middleware in this stack
  next();
});

exports.IsUserRegistred = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const eventId = req.body.createdForEventId;
  const queryId = req.query.id;
  const userCreatingQuery = await User.findById(userId);
  const queryGettingUpdated = await Query.findById(queryId);
  // 5) Check if user is registred in this event for which he / she is trying to create a query for
  const bool = userCreatingQuery.registredInEvents
    ? userCreatingQuery.registredInEvents.includes(eventId)
    : false;
  if (bool) {
    queryGettingUpdated.userIs = "Registred";
  } else {
    queryGettingUpdated.userIs = "Unregistered";
  }
  const updatedQuery = await queryGettingUpdated.save({
    validateModifiedOnly: true,
  });

  // 6) Send finally updated Query document back to user
  res.status(200).json({
    status: "success",
    data: updatedQuery,
  });
});

// exports.getMe = catchAsync(async (req, res, next) => {
//   const userId = req.user.id;
//   const userDoc = await User.findById(userId).populate({
//     path: "registredInEvents queries",
//     select:
//       "startDate endDate eventName shortDescription createdAt queryIs questionText",
//   });
//   res.status(200).json({
//     status: "success",
//     data: {
//       userData: userDoc,
//     },
//   });
// });

exports.getMe = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const userDoc = await User.findById(userId).populate({
    path: "registredInEvents",

    populate: {
      path: "speaker tickets coupon sponsors session booths",
    },
  });
  res.status(200).json({
    status: "success",
    data: {
      userData: userDoc,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // const key = req.body.key;
  // console.log(key);

  console.log("updated you ");
  const userId = req.user.id;
  const filteredBody = filterObj(
    req.body,
    "phoneNumber",
    "firstName",
    "lastName",
    "headline",
    "email",
    "photo",
    "interests",
    "socialMediaHandles",
    "notificationsForRegisteredEvents",
    "notificationsForEventRemainder",
    "notificationBasedOnMyPreference",
    "image"
  );
  console.log(filteredBody);
  const updatedUser = await User.findByIdAndUpdate(userId, filteredBody, {
    new: true,
    runValidators: true,
  });
  console.log(updatedUser);
  // const twiceUpdatedUser = await User.findByIdAndUpdate(
  //   userId,
  //   {image: key},
  //   {
  //     new: true,
  //     runValidators: true,
  //   }
  // );

  // console.log(twiceUpdatedUser.image);

  res.status(201).json({
    status: "success",
    data: {
      userData: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  await User.findByIdAndUpdate(
    userId,
    { active: false },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(202).json({
    status: "success",
  });
});

// TODO
exports.forgotPassword = catchAsync(async (req, res, next) => {
  console.log("I reached here in forgot password");
  console.log(req.body);
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError(
        "There is no user with email address or you signed up with google .",
        404
      )
    );
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  console.log(resetToken);

  // 3) Send it to user's email
  try {
    const resetURL = `http://localhost:3001/resetPassword/${resetToken}`;

    // Send Grid is implemented here

    const msg = {
      to: user.email, // Change to your recipient
      from: "shreyanshshah242@gmail.com", // Change to your verified sender
      subject: "Your Password Reset Link",
      text: "use this link to reset your password. This link is valid for only 10 min.",
      html: ForgotPasswordTemplate(user, resetURL),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
        res.status(200).json({
          status: "success",
          message: "Token sent to email!",
        });
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

// TODO
exports.createNewCommunity = catchAsync(async (req, res, next) => {
  // console.log(req);
  console.log(req.body.image);
  console.log(req.user);
  const userId = req.user.id;
  const userCreatingCommunity = await User.findById(userId);
  const speakersIdsDocument = await SpeakersIdsCommunityWise.create({
    initialisedAt: Date.now(),
  });
  const eventTransactionIdsDocument =
    await EventTransactionIdsCommunityWise.create({
      initialisedAt: Date.now(),
    });
  const reviewsIdsDocument = await ReviewsIdsCommunityWise.create({
    initialisedAt: Date.now(),
  });
  const eventsIdsDocument = await EventsIdsCommunityWise.create({
    initialisedAt: Date.now(),
  });
  const queriesIdsDocument = await QueriesIdsCommunityWise.create({
    initialisedAt: Date.now(),
  });
  const registrationsIdsDocument = await RegistrationsIdsCommunityWise.create({
    initialisedAt: Date.now(),
  });
  // 1) Create a new community and store id of loggedIn user as superAdmin in community
  const createdCommunity = await Community.create({
    name: req.body.name,
    superAdmin: req.user.id,
    email: req.body.email,
    image: req.body.image,
    payPalEmail: req.body.email,
    headline: req.body.headline,
    policySigned: req.body.policySigned,
    subscribedToCommunityMailList: req.body.subscribedToCommunityMailList,
    queriesDocIdCommunityWise: queriesIdsDocument._id,
    eventsDocIdCommunityWise: eventsIdsDocument._id,
    reviewsDocIdCommunityWise: reviewsIdsDocument._id,
    speakersDocIdCommunityWise: speakersIdsDocument._id,
    registrationsDocIdCommunityWise: registrationsIdsDocument._id,
    eventTransactionDocIdCommunityWise: eventTransactionIdsDocument._id,
    superAdmin: req.user.id,
    superAdminName: `${req.user.firstName} ${req.user.lastName}`,
    superAdminEmail: req.user.email,
    superAdminImage: req.user.image,
    paypalTrackingId: UUID(),
  });

  userCreatingCommunity.communities.push(createdCommunity.id);
  await userCreatingCommunity.save({ validateModifiedOnly: true });

  if (req.body.subscribedToCommunityMailList === true) {
    await CommunityMailList.create({
      name: req.body.name,
      email: req.body.email,
    });
  }
  createSendTokenForCommunityLogin(
    userId,
    createdCommunity.id,
    200,
    createdCommunity,
    res
  );
});
exports.getAllRegisteredEvents = catchAsync(async (req, res, next) => {
  const registeredInEventsList = await User.findById(req.user.id)
    .select("registeredInEvents")
    .populate({
      path: "registeredInEvents",

      populate: {
        path: "tickets speaker sponsors session createdBy coupon",
        options: {
          match: {
            status: "Active",
          },
        },
      },
    });

  console.log(registeredInEventsList);
  res.status(200).json({
    status: "SUCCESS",
    data: {
      registeredInEventsList,
    },
  });
});
