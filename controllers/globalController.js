const jwt = require("jsonwebtoken");
const Event = require("../models/eventModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const apiFeatures = require("../utils/apiFeatures");
const AppSumoCodes = require("./../models/appSumoCodesModel");
const Community = require("./../models/communityModel");
const CommunityTransaction = require("./../models/communityTransactionModel");
const mongoose = require("mongoose");
const RequestIntegration = require("./../models/requestIntegrationModel");
const BuildWithBluemeet = require("./../models/buildWithBluemeetModel");
const Session = require("./../models/sessionModel");
const Speaker = require("./../models/speakerModel");
const PersonalChat = require("./../models/PersonalChatModel");
const Registration = require("./../models/registrationsModel");
const RoomTable = require("../models/roomTableModel");
const BoothTable = require("./../models/boothTableModel");
const TableChats = require("./../models/tableChatsModel");
const BoothChats = require("./../models/boothChatsModel");
const BoothTableChats = require("./../models/boothTableChatsModel");
const SessionQnA = require("./../models/sessionQnAModel");
const SessionPoll = require("./../models/sessionPollModel");
const CommunityAccountRequest = require("./../models/CommunityAccountRequestModel");
const UserAccountRequest = require("./../models/UserAccountRequest");
const CommunityVideo = require("./../models/videoModel");
const EventVideo = require("./../models/eventVideosModel");
const EventsIdsCommunityWise = require("../models/eventsIdsCommunityWiseModel");
const RegistrationForm = require("./../models/registrationFormModel");
const PaypalEmailChange = require("./../models/paypalEmailChangeModel");
const PaypalPayout = require("./../models/paypalPayoutModel");
const Report = require("./../models/reportModel");
const Coupon = require("./../models/couponModel");
const Ticket = require("./../models/ticketModel");
const Booth = require("./../models/boothModel");
const Review = require("./../models/reviewModel");
const Track = require("./../models/trackModel");
const Vibe = require("./../models/vibeModel");

const EventChatMessage = require("./../models/eventChatMessageModel");
const SessionChats = require("./../models/sessionChatMessageModel");
const NetworkingRoomChat = require("./../models/NetworkingRoomChatsModel");

const { nanoid } = require("nanoid");
const random = require("random");
var btoa = require("btoa");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const Mux = require("@mux/mux-node");
const { Video } = new Mux(
  process.env.MUX_TOKEN_ID,
  process.env.MUX_TOKEN_SECRET
);

const {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} = require("agora-access-token");
const StreamDestination = require("../models/streamDestinationModel");
const TeamInvite = require("../models/teamInviteModel");
const AppSumoCodeRedeemed = require("../Mail/AppSumoCodeRedeemed");
const SessionReminder = require("../Mail/SessionReminder");
const VerifyCommunityEmail = require("../Mail/VerifyCommunityEmail");
const VerifyUserEmail = require("../Mail/VerifyUserEmail");
const VerifyPayPalEmail = require("../Mail/VerifyPayPalEmail");
const AlertPayoutEmailChanged = require("../Mail/AlertPayoutEmailChanged");
const PayPalPayoutOnItsWay = require("../Mail/PayPalPayoutOnItsWay");
const ProcessPayout = require("../Mail/ProcessPayout");
const ReportReceived = require("../Mail/ReportReceived");
const PleaseReviewEvent = require("../Mail/PleaseReviewEvent");
const AcceptedInEvent = require("../Mail/AcceptedInEvent");

exports.aliasTopEvents = catchAsync(async (req, res, next) => {
  req.query.sort = "-numberOfRegistrationsReceived";
  next();
});

exports.getAllEvents = catchAsync(async (req, res, next) => {
  const result = await Event.updateMany(
    {
      $or: [
        { endDate: { $lt: Date.now() } },
        {
          $and: [
            { endDate: { $lte: Date.now() } },
            { endTime: { $lt: Date.now() } },
          ],
        },
      ],
    },
    { status: "Ended" }
  );

  const query = Event.find({
    $and: [
      { status: { $ne: "Ended" } },
      { publishedStatus: "Published" },
      { visibility: "Public" },
      { stopTicketSale: false },
    ],
  })
    .populate({
      path: "tickets",
      options: {
        sort: ["price"],
      },
    })
    .populate("sponsors")
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

  const features = new apiFeatures(query, req.query)
    .priceWiseFilter()
    .textFilter()
    .categoryWiseFilter()
    .dateWiseFilter()
    .paginate()
    .ratingFilter()
    .sort();

  const eventDocuments = await features.query;

  res.status(200).json({
    status: "success",
    length: eventDocuments.length,
    data: {
      events: eventDocuments,
    },
  });
});

exports.DoesUserRegistredInThisEvent = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const eventId = req.params.eventId;
  const userCreatingReview = await User.findById(userId);

  const bool = userCreatingReview.registredInEvents.includes(eventId);
  if (bool) {
    next();
  } else {
    return next(
      new AppError(
        `You need to register in this event in order to perform this action.`,
        400
      )
    );
  }
});

exports.IsUserAlreadyRegistred = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const eventId = req.params.eventId;
  const userGettingRegistered = await User.findById(userId);

  const bool = userGettingRegistered.registredInEvents.includes(eventId);
  if (bool) {
    return next(new AppError(`You can only register once in an event.`, 400));
  } else {
    next();
  }
});

const signTokenForEventAccess = (id, role, eventId) =>
  jwt.sign({ id: id, role: role, eventId: eventId }, process.env.JWT_SECRET);

const createSendTokenForEventAccess = async (
  id,
  role,
  eventId,
  statusCode,
  req,
  res
) => {
  const EventAccessToken = signTokenForEventAccess(id, role, eventId);

  res.status(statusCode).json({
    status: "success",
    EventAccessToken,
  });
};

exports.createEventAccessToken = catchAsync(async (req, res, next) => {
  const role = req.body.role;
  const id = req.body.id;
  const eventId = req.body.eventId;

  createSendTokenForEventAccess(id, role, eventId, 200, req, res);
});

exports.generateTokenForVideoCall = catchAsync(async (req, res, next) => {
  const channel = req.body.tableId;
  const userId = req.user._id;

  const appID = "afe1eaa28f57452a865fa81190eed1c2";
  const appCertificate = "f6e4b7f46711411c85bf1e303801f89a";
  const channelName = channel;
  const uid = userId;
  const account = "2882341273";
  const role = RtcRole.PUBLISHER;

  const expirationTimeInSeconds = 3600;

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

  // Build token with uid
  const token = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  res.status(200).json({
    status: "success",
    token: token,
  });
});

exports.generateRTMToken = catchAsync(async (req, res, next) => {
  const channel = req.body.eventId;

  const userId = req.user._id;

  const appID = "afe1eaa28f57452a865fa81190eed1c2";
  const appCertificate = "b4b72a553f324888b790e16ad6da0f87";

  const account = userId.toString();

  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);

  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtmTokenBuilder.buildToken(
    appID,
    appCertificate,
    account,
    RtmRole,
    privilegeExpiredTs
  );

  res.status(200).json({
    status: "success",
    token: token,
  });
});

exports.generateRTMTokenForSpeaker = catchAsync(async (req, res, next) => {
  const channel = req.body.eventId;

  const speakerId = req.body.speakerId;

  const appID = "afe1eaa28f57452a865fa81190eed1c2";
  const appCertificate = "b4b72a553f324888b790e16ad6da0f87";

  const account = speakerId.toString();

  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);

  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtmTokenBuilder.buildToken(
    appID,
    appCertificate,
    account,
    RtmRole,
    privilegeExpiredTs
  );

  res.status(200).json({
    status: "success",
    token: token,
  });
});

exports.generateTokenForLiveStreaming = catchAsync(async (req, res, next) => {
  const channel = req.body.channelId;
  const userId = req.user._id;
  const isPublisher = req.body.role === "host" ? true : false;

  const appID = "afe1eaa28f57452a865fa81190eed1c2";
  const appCertificate = "b4b72a553f324888b790e16ad6da0f87";
  const channelName = channel;
  const uid = userId;
  const role = isPublisher ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  const expirationTimeInSeconds = 3600;

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  // Find session document

  const SessionDoc = await Session.findById(req.body.sessionId)
    .populate("host")
    .populate("speaker")
    .populate("people");

  // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

  // Build token with uid

  const token = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  res.status(200).json({
    status: "success",
    token: token,
    session: SessionDoc,
  });
});

exports.getLiveStageToken = catchAsync(async (req, res, next) => {
  try {
    const channel = `${req.body.sessionId}-live`;
    const userId = req.user._id;

    const appID = "afe1eaa28f57452a865fa81190eed1c2";
    const appCertificate = "b4b72a553f324888b790e16ad6da0f87";
    const channelName = channel;
    const uid = userId;
    const role = RtcRole.PUBLISHER;

    const expirationTimeInSeconds = 3600;

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Find session document

    const SessionDoc = await Session.findById(req.body.sessionId)
      .populate("host")
      .populate("speaker");

    // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

    // Build token with uid

    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    console.log(token);

    res.status(200).json({
      status: "success",
      token: token,
      session: SessionDoc,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.getBackstageToken = catchAsync(async (req, res, next) => {
  try {
    const channel = `${req.body.sessionId}-back`;
    const userId = req.user._id;

    const appID = "afe1eaa28f57452a865fa81190eed1c2";
    const appCertificate = "b4b72a553f324888b790e16ad6da0f87";
    const channelName = channel;
    const uid = userId;
    const role = RtcRole.PUBLISHER;

    const expirationTimeInSeconds = 3600;

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Find session document

    const SessionDoc = await Session.findById(req.body.sessionId)
      .populate("host")
      .populate("speaker");

    // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

    // Build token with uid

    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    console.log(token);

    res.status(200).json({
      status: "success",
      token: token,
      session: SessionDoc,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.generateLiveStreamingTokenForJoiningTable = catchAsync(
  async (req, res, next) => {
    const tableId = req.body.tableId;
    const userId = req.body.userId;
    const isPublisher = true;

    const appID = "afe1eaa28f57452a865fa81190eed1c2";
    const appCertificate = "b4b72a553f324888b790e16ad6da0f87";
    const channelName = tableId;
    const uid = userId;
    const role = isPublisher ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    const expirationTimeInSeconds = 3600;

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

    // Build token with uid
    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    res.status(200).json({
      status: "success",
      token: token,
    });
  }
);

exports.getTokenForBoothTable = catchAsync(async (req, res, next) => {
  const tableId = req.body.tableId;
  const userId = req.body.userId;
  const isPublisher = true;

  const appID = "afe1eaa28f57452a865fa81190eed1c2";
  const appCertificate = "b4b72a553f324888b790e16ad6da0f87";
  const channelName = tableId;
  const uid = userId;
  const role = isPublisher ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  const expirationTimeInSeconds = 3600;

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

  // Build token with uid
  const token = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  res.status(200).json({
    status: "success",
    token: token,
  });
});

exports.getLiveStreamingTokenForNetworking = catchAsync(
  async (req, res, next) => {
    try {
      const roomId = req.body.roomId;
      const userId = req.body.userId;

      console.log(roomId, userId, "Room Id", "User Id");

      const appID = "afe1eaa28f57452a865fa81190eed1c2";
      const appCertificate = "b4b72a553f324888b790e16ad6da0f87";

      const channelName = roomId;
      const uid = userId;
      const role = RtcRole.PUBLISHER;

      const expirationTimeInSeconds = 3600;

      const currentTimestamp = Math.floor(Date.now() / 1000);

      const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

      // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

      // Build token with uid
      const token = RtcTokenBuilder.buildTokenWithUid(
        appID,
        appCertificate,
        channelName,
        uid,
        role,
        privilegeExpiredTs
      );

      console.log(token);

      res.status(200).json({
        status: "success",
        token: token,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

exports.generateTokenForLiveStreamingForNonUser = catchAsync(
  async (req, res, next) => {
    const channel = req.body.sessionId;
    const userId = req.body.userId;
    const isPublisher = req.body.role === "host" ? true : false;

    const appID = "afe1eaa28f57452a865fa81190eed1c2";
    const appCertificate = "b4b72a553f324888b790e16ad6da0f87";
    const channelName = channel;
    const uid = userId;
    const role = isPublisher ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    const expirationTimeInSeconds = 3600;

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // IMPORTANT! Build token with either the uid or with the user account.
    // Comment out the option you do not want to use below.

    // Build token with uid
    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    res.status(200).json({
      status: "success",
      token: token,
    });
  }
);

exports.generateTokenForLiveStreamingForScreenShare = catchAsync(
  async (req, res, next) => {
    const channel = req.body.channel;
    const myUID = req.body.uid;

    const appID = "afe1eaa28f57452a865fa81190eed1c2";
    const appCertificate = "b4b72a553f324888b790e16ad6da0f87";
    const channelName = channel;
    const uid = myUID;
    const role = RtcRole.PUBLISHER;

    const expirationTimeInSeconds = 3600;

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // IMPORTANT! Build token with either the uid or with the user account.
    // Comment out the option you do not want to use below.

    // Build token with uid
    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    res.status(200).json({
      status: "success",
      token: token,
    });
  }
);

exports.generateTokenForBoothScreenShare = catchAsync(
  async (req, res, next) => {
    const channel = req.body.channel;
    const myUID = req.body.uid;

    const appID = "afe1eaa28f57452a865fa81190eed1c2";
    const appCertificate = "b4b72a553f324888b790e16ad6da0f87";
    const channelName = channel;
    const uid = myUID;
    const role = RtcRole.PUBLISHER;

    const expirationTimeInSeconds = 3600;

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // IMPORTANT! Build token with either the uid or with the user account.
    // Comment out the option you do not want to use below.

    // Build token with uid
    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    res.status(200).json({
      status: "success",
      token: token,
    });
  }
);

exports.getTawkLink = catchAsync(async (req, res, next) => {
  try {
    const communityId = req.params.communityId;

    const communityDoc = await Community.findById(communityId);

    const tawkLink = communityDoc.tawkLink;

    res.status(200).json({
      data: { tawkLink: tawkLink },
      message: "success",
    });
  } catch (error) {
    console.log(error);
  }
});

exports.generateMUXCredentials = catchAsync(async (req, res, next) => {
  const muxRes = await Video.LiveStreams.create({
    playback_policy: "public",
    new_asset_settings: { playback_policy: "public" },
  });

  res.status(200).json({
    status: "success",
    data: muxRes,
  });
});

exports.createRTMPDestination = catchAsync(async (req, res, next) => {
  const type = req.body.type;
  const liveStreamPageURL = req.body.liveStreamPageURL;
  const rtmpServerKey = req.body.rtmpServerKey;
  const rtmpServerURL = req.body.rtmpServerURL;
  const sessions = req.body.sessions;
  const streamFriendlyName = req.body.streamFriendlyName;
  const eventId = req.params.eventId;

  const newStreamDestination = await StreamDestination.create(
    {
      type: type,
      liveStreamPageURL: liveStreamPageURL,
      rtmpServerKey: rtmpServerKey,
      rtmpServerURL: rtmpServerURL,
      sessions: sessions,
      streamFriendlyName: streamFriendlyName,
      eventId: eventId,
    },
    async (err, doc) => {
      const populatedDoc = await StreamDestination.findById(doc._id).populate(
        "sessions",
        "name"
      );

      res.status(200).json({
        status: "success",
        data: populatedDoc,
      });
    }
  );
});

exports.getRTMPDestinations = catchAsync(async (req, res, next) => {
  await StreamDestination.find(
    { eventId: req.params.eventId },
    async (err, doc) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          status: "error",
          message: "Failed to get stream destinations.",
        });
      } else {
        const populatedDoc = await StreamDestination.find({
          eventId: req.params.eventId,
        }).populate("sessions", "name");
        res.status(200).json({
          status: "success",
          data: populatedDoc,
        });
      }
    }
  );
});

exports.getOneStreamDestination = catchAsync(async (req, res, next) => {
  await StreamDestination.findById(
    req.params.destinationId,
    async (err, doc) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          status: "error",
          message: "Failed to get stream destination.",
        });
      } else {
        const populatedDoc = await StreamDestination.findById(doc._id).populate(
          "sessions",
          "name"
        );
        res.status(200).json({
          status: "success",
          data: populatedDoc,
        });
      }
    }
  );
});

exports.updateStreamDestination = catchAsync(async (req, res, next) => {
  try {
    const filteredBody = filterObj(
      req.body,
      "sessions",
      "liveStreamPageURL",
      "rtmpServerKey",
      "rtmpServerURL",
      "streamFriendlyName"
    );

    const destinationDoc = await StreamDestination.findByIdAndUpdate(
      req.params.destinationId,
      filteredBody,
      {
        new: true,
        validateModifiedOnly: true,
      }
    ).populate("sessions", "name");

    res.status(200).json({
      status: "success",
      data: destinationDoc,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.deleteStreamDestination = catchAsync(async (req, res, next) => {
  const deletedDoc = await StreamDestination.findByIdAndDelete(
    req.params.destinationId
  );
  res.status(200).json({
    status: "success",
    message: "Stream destination deleted successfully!",
  });
});

exports.generateCodes = catchAsync(async (req, res, next) => {
  try {
    for (let i = 0; i <= 25000; i++) {
      await AppSumoCodes.create({
        code: nanoid(),
      });
      console.log("Successfully created code!");
    }
  } catch (error) {
    console.log(error);
  }

  res.status(200).json({
    status: "success",
    message: "Codes created successfully!",
  });
});

exports.getCodes = catchAsync(async (req, res, next) => {
  const codes = await AppSumoCodes.find({});

  res.status(200).json({
    status: "success",
    data: codes,
  });
});

exports.redeemAppSumoCode = catchAsync(async (req, res, next) => {
  // community Id
  const communityId = req.body.communityId;
  const userId = req.body.userId;
  const codes = req.body.codes;

  const userDoc = await User.findById(userId);

  const communityDoc = await Community.findById(communityId);

  const codesDoc = await AppSumoCodes.find({ status: "Unused" });

  const codesArray = codesDoc.map((el) => el.code);

  let bool = false; // Flag which indicates if codes we have recieved are legit or not

  for (let element of codes) {
    bool = codesArray.includes(element);
  }

  let numOfCodesRedeemed = communityDoc.codesApplied.length;

  let providedUsedCode = false;

  for (let element of codes) {
    providedUsedCode = communityDoc.codesApplied.includes(element);
  }

  // Check if any of the provided code is already added into community if yes then reject this redemption
  // Check if community has already used 3 codes if yes then reject this redemption

  const eligible = bool && !providedUsedCode && numOfCodesRedeemed * 1 <= 2;

  if (eligible) {
    try {
      // Go forward with redemption process

      // push new ones to the array of appSumo codes of this community's document

      let totalNumOfCodes = 0;

      for (let element of codes) {
        totalNumOfCodes = communityDoc.codesApplied.push(element);
      }

      // Now get back total no. of codes in community doc

      if (totalNumOfCodes * 1 === 1) {
        // If total = 1 => Analytics => true, Available integrations (GA, FB pixel, Typeform, Tawk), unlimited events, no booth, no sponsor, 72 hour, 100 Registrations, only paid ticket, No branding, No Coupon, No Live Streaming, 2 team members

        // Set up isAppSumoCustomer & analytics available => true

        communityDoc.isUsingFreePlan = false;

        communityDoc.isAppSumoCustomer = true;
        communityDoc.isAnalyticsAvailable = true;

        // Setting up integrations permissions
        communityDoc.isMailchimpAvailable = false;
        communityDoc.isSalesforceAvailable = false;
        communityDoc.isHubspotAvailable = false;
        communityDoc.isTawkAvailable = true;
        communityDoc.isTypeformAvailable = true;
        communityDoc.isGoogleAnalyticsAvailable = true;
        communityDoc.isFacebookPixelAvailable = true;
        communityDoc.isZapierAvailable = false;

        communityDoc.canMakeUnlimitedEvents = true; // if false then only 2 events per month will be allowed

        // Booth & Sponsor will be available only for stacking 3 codes
        communityDoc.isBoothAvailable = false;
        communityDoc.isSponsorAvailable = false;

        communityDoc.isLiveStreamingAvailable = false;
        communityDoc.isCouponsAvailable = false;
        // communityDoc.availableIntegrations = "zapier";

        // No Branding is allowed
        communityDoc.isCustomisationAvailable = false;

        // Stage backdrop is allowed
        communityDoc.isBackdropAvailable = true;

        // Ticketing charge is 7% for all except free in which case it will be 15%
        communityDoc.ticketingCharge = 7;

        communityDoc.allowedRegistrationLimit = 100;

        communityDoc.streamingHoursLimit = 72;

        communityDoc.organisersLimit = 2;

        communityDoc.planName = "AppSumo";

        communityDoc.canCreateFreeTicket = false;
      }

      if (totalNumOfCodes * 1 === 2) {
        // If total = 2 => Analytics => true, Available integrations (GA, FB pixel, Typeform, Tawk, Hubspot, Mailchimp), unlimited events, no booth, no sponsor, 144 hour, 300 Registrations, only paid ticket, branding available, unlimited Coupon, Live Streaming available, 4 team members

        // Set up isAppSumoCustomer & analytics available => true

        communityDoc.isUsingFreePlan = false;

        communityDoc.isAppSumoCustomer = true;
        communityDoc.isAnalyticsAvailable = true;

        // Setting up integrations permissions
        communityDoc.isMailchimpAvailable = true;
        communityDoc.isSalesforceAvailable = false;
        communityDoc.isHubspotAvailable = true;
        communityDoc.isTawkAvailable = true;
        communityDoc.isTypeformAvailable = true;
        communityDoc.isGoogleAnalyticsAvailable = true;
        communityDoc.isFacebookPixelAvailable = true;
        communityDoc.isZapierAvailable = false;

        communityDoc.canMakeUnlimitedEvents = true; // if false then only 2 events per month will be allowed

        // Booth & Sponsor will be available only for stacking 3 codes
        communityDoc.isBoothAvailable = false;
        communityDoc.isSponsorAvailable = false;

        communityDoc.isLiveStreamingAvailable = true;
        communityDoc.isCouponsAvailable = true;
        // communityDoc.availableIntegrations = "zapier";

        // No Branding is allowed
        communityDoc.isCustomisationAvailable = true;

        // Stage backdrop is allowed
        communityDoc.isBackdropAvailable = true;

        // Ticketing charge is 7% for all except free in which case it will be 15%
        communityDoc.ticketingCharge = 7;

        communityDoc.allowedRegistrationLimit = 300;

        communityDoc.streamingHoursLimit = 144;

        communityDoc.organisersLimit = 4;

        communityDoc.planName = "AppSumo";

        communityDoc.canCreateFreeTicket = false;
      }
      if (totalNumOfCodes * 1 === 3) {
        // If total = 3 => Analytics => true, Available integrations (GA, FB pixel, Typeform, Tawk, Hubspot, Mailchimp, Salesforce, Zapier), unlimited events, booth available, sponsor available, 288 hour, 500 Registrations, Free & Paid ticket, branding available, unlimited Coupon, Live Streaming available, 8 team members

        // Set up isAppSumoCustomer & analytics available => true

        communityDoc.isUsingFreePlan = false;

        communityDoc.isAppSumoCustomer = true;
        communityDoc.isAnalyticsAvailable = true;

        // Setting up integrations permissions
        communityDoc.isMailchimpAvailable = true;
        communityDoc.isSalesforceAvailable = true;
        communityDoc.isHubspotAvailable = true;
        communityDoc.isTawkAvailable = true;
        communityDoc.isTypeformAvailable = true;
        communityDoc.isGoogleAnalyticsAvailable = true;
        communityDoc.isFacebookPixelAvailable = true;
        communityDoc.isZapierAvailable = true;

        communityDoc.canMakeUnlimitedEvents = true; // if false then only 2 events per month will be allowed

        // Booth & Sponsor will be available only for stacking 3 codes
        communityDoc.isBoothAvailable = true;
        communityDoc.isSponsorAvailable = true;

        communityDoc.isLiveStreamingAvailable = true;
        communityDoc.isCouponsAvailable = true;
        // communityDoc.availableIntegrations = "zapier";

        // No Branding is allowed
        communityDoc.isCustomisationAvailable = true;

        // Stage backdrop is allowed
        communityDoc.isBackdropAvailable = true;

        // Ticketing charge is 7% for all except free in which case it will be 15%
        communityDoc.ticketingCharge = 7;

        communityDoc.allowedRegistrationLimit = 500;

        communityDoc.streamingHoursLimit = 288;

        communityDoc.organisersLimit = 8;

        communityDoc.planName = "AppSumo";

        communityDoc.canCreateFreeTicket = true;
      }

      // Save all changes

      const updatedCommunity = await communityDoc.save({
        new: true,
        validateModifiedOnly: true,
      });

      // Mark the used codes as used in our database.

      for (let element of codes) {
        await AppSumoCodes.findOneAndUpdate(
          { code: element },
          { status: "Used" }
        );
        // Updated codes status as well
      }

      //* Now send a mail to community admin and person who applied code that the process was successful. Enjoy LetStream and have a good day ahead. Thanks for embarking on this journey with us. See you soon.

      const mailsArray = [communityDoc.superAdminEmail, userDoc.email];

      for (let element of mailsArray) {
        const msg = {
          to: element, // Change to your recipient
          from: "payments@letstream.live", // Change to your verified sender
          subject: "AppSumo codes redeemed!",
          text: `${totalNumOfCodes} Codes have been successfully applied to your LetStream Community. ${communityDoc.name}.`,
          html: AppSumoCodeRedeemed(communityDoc.name, totalNumOfCodes),
        };

        sgMail
          .send(msg)
          .then(async () => {
            console.log(
              "Confirmation mail sent to User and Community Super admin."
            );
          })
          .catch(async (error) => {
            console.log(
              "Failed to send confirmation mail to user and Community."
            );
          });
      }

      // console.log(updatedCommunity);
      // console.log(communityDoc);

      res.status(200).json({
        status: "success",
        message: "Codes redeemed successfully!",
        data: updatedCommunity, // Send updated commuity as response
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    // Someone is just trying their luck. Just let it pass.

    // Codes are not valid then send response saying that

    res.status(400).json({
      status: "error",
      message: "Codes are not valid or already used please check again.",
    });
  }
});

exports.requestIntegration = catchAsync(async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const communityId = req.body.communityId;
  const requestedIntegrations = req.body.requestedIntegrations;
  const otherIntegrations = req.body.otherIntegrations;

  await RequestIntegration.create({
    name: name,
    email: email,
    communityId: communityId,
    requestedIntegrations: requestedIntegrations,
    otherIntegrations: otherIntegrations,
    initiatedAt: Date.now(),
  });

  // TODO Send a mail to a letstream person saying that someone has requested an integration

  res.status(200).json({
    status: "success",
  });
});

exports.buildWithBluemeet = catchAsync(async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const communityId = req.body.communityId;
  const productName = req.body.productName;
  const companyName = req.body.companyName;
  const productDescription = req.body.productDescription;

  await BuildWithBluemeet.create({
    name: name,
    email: email,
    communityId: communityId,
    productName: productName,
    companyName: companyName,
    productDescription: productDescription,
    initiatedAt: Date.now(),
  });

  // TODO Send a mail to a letstream person saying that someone has proposed an integration

  res.status(200).json({
    status: "success",
  });
});

exports.getCommunityTransactions = catchAsync(async (req, res, next) => {
  const communityId = req.params.communityId;

  const transactions = await CommunityTransaction.find({
    communityId: mongoose.Types.ObjectId(communityId),
  });

  res.status(200).json({
    status: "success",
    data: transactions,
  });
});

// ***************** Acquire cloud recording resource ******************* //

exports.acquireRecordingResource = catchAsync(async (req, res, next) => {
  const channelName = req.params.channelName;
  const isPublisher = false;
  const appID = "afe1eaa28f57452a865fa81190eed1c2";
  const appCertificate = "b4b72a553f324888b790e16ad6da0f87";
  const role = isPublisher ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  const expirationTimeInSeconds = 3600;

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  // Build token with uid
  const token = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    "527841",
    role,
    privilegeExpiredTs
  );

  console.log("Channel name", channelName, process.env.AGORA_APP_ID);

  const customerKey = process.env.AGORA_CUSTOMER_KEY;
  // Customer secret
  const customerSecret = process.env.AGORA_CUSTOMER_SECRET;

  // Concatenate customer key and customer secret and use base64 to encode the concatenated string
  const plainCredential = customerKey + ":" + customerSecret;

  // Encode with base64
  encodedCredential = btoa(plainCredential);

  try {
    const response = await fetch(
      `https://api.agora.io/v1/apps/${process.env.AGORA_APP_ID}/cloud_recording/acquire`,
      {
        method: "POST",

        body: JSON.stringify({
          cname: channelName,
          uid: "527841",
          clientRequest: {},
        }),

        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedCredential}`,
        },
      }
    );

    if (!response.ok) {
      res.status(400).json({
        status: "error",
        message: "Failed to acquire recording resource.",
      });

      throw new Error("Something went wrong");
    }

    const result = await response.json();

    const startResponse = await fetch(
      `https://api.agora.io/v1/apps/${process.env.AGORA_APP_ID}/cloud_recording/resourceid/${result.resourceId}/mode/mix/start`,
      {
        method: "POST",

        body: JSON.stringify({
          uid: "527841",
          cname: channelName,
          clientRequest: {
            token: token,
            recordingConfig: {
              maxIdleTime: 21600,
              streamTypes: 2,
              channelType: 0,
              videoStreamType: 0,
              transcodingConfig: {
                height: 640,
                width: 360,
                bitrate: 500,
                fps: 15,
                mixedVideoLayout: 0,
                backgroundColor: "#212121",
              },
            },
            recordingFileConfig: {
              avFileType: ["hls", "mp4"],
            },
            storageConfig: {
              accessKey: "AKIA4IKLDA4ABVU7DUJJ",
              region: 2,
              bucket: "letstream-inc",
              secretKey: "IBL4uBLaHv7RDyZo6c1gNTKqttwGrybHCll/wtBF",
              vendor: 1,
              fileNamePrefix: ["cloudrecording", "session"],
            },
          },
        }),

        headers: {
          "Content-Type": "application/json;charset=utf-8",
          Authorization: `Basic ${encodedCredential}`,
        },
      }
    );

    if (!startResponse.ok) {
      res.status(400).json({
        status: "error",
        message: "Failed to start recording.",
        res: startResponse,
      });

      throw new Error("Something went wrong");
    }

    const startResult = await startResponse.json();

    console.log(startResult);

    await Session.findByIdAndUpdate(channelName, {
      resourceId: startResult.resourceId,
      sid: startResult.sid,
    });

    next();
  } catch (error) {
    console.log(error);
  }
});

exports.getRecordingStatus = catchAsync(async (req, res, next) => {
  const sessionId = req.params.channelName;

  const sessionDoc = await Session.findById(sessionId);
  const resourceId = sessionDoc.resourceId;
  const sid = sessionDoc.sid;

  const customerKey = process.env.AGORA_CUSTOMER_KEY;
  // Customer secret
  const customerSecret = process.env.AGORA_CUSTOMER_SECRET;

  // Concatenate customer key and customer secret and use base64 to encode the concatenated string
  const plainCredential = customerKey + ":" + customerSecret;

  // Encode with base64
  encodedCredential = btoa(plainCredential);

  const response = await fetch(
    `https://api.agora.io/v1/apps/${process.env.AGORA_APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/query`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedCredential}`,
      },
    }
  );

  if (!response.ok) {
    res.status(400).json({
      status: "error",
      message: "Failed to fetch recording status.",
      res: response,
    });

    throw new Error("Something went wrong");
  } else {
    const result = await response.json();

    console.log(result, "This is the result of querying recording status.");

    res.status(200).json({
      status: "success",
      data: result,
    });
  }
});

exports.stopCloudRecording = catchAsync(async (req, res, next) => {
  const sessionId = req.params.sessionId;

  const sessionDoc = await Session.findById(sessionId);
  const resourceId = sessionDoc.resourceId;
  const sid = sessionDoc.sid;

  const customerKey = process.env.AGORA_CUSTOMER_KEY;
  // Customer secret
  const customerSecret = process.env.AGORA_CUSTOMER_SECRET;

  // Concatenate customer key and customer secret and use base64 to encode the concatenated string
  const plainCredential = customerKey + ":" + customerSecret;

  // Encode with base64
  encodedCredential = btoa(plainCredential);

  const response = await fetch(
    `https://api.agora.io/v1/apps/${process.env.AGORA_APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/stop`,
    {
      method: "POST",

      body: JSON.stringify({
        cname: sessionId,
        uid: "527841",
        clientRequest: {
          async_stop: true,
        },
      }),

      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedCredential}`,
      },
    }
  );

  if (!response.ok) {
    res.status(400).json({
      status: "error",
      message: "Failed to stop recording.",
      res: response,
    });

    throw new Error("Something went wrong");
  } else {
    const result = await response.json();

    console.log(result, "This is the result of stopping cloud recording.");

    res.status(200).json({
      status: "success",
      data: result,
    });
  }
});

exports.getEventSpeakers = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  const speakers = await Speaker.find({
    eventId: mongoose.Types.ObjectId(eventId),
  });

  let users = [];

  for (let element of speakers) {
    const userDoc = await User.findOne({ email: element.email });
    // console.log(element.userId, userDoc, "This is speakers user doc");
    if (userDoc) {
      users.push(userDoc);
    }
  }

  res.status(200).json({
    status: "success",
    data: users,
  });
});

exports.getPeopleInEvent = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  const query = Registration.find({
    bookedForEventId: mongoose.Types.ObjectId(eventId),
  });

  const features = new apiFeatures(query, req.query).textFilter();

  const registrations = await features.query;

  res.status(200).json({
    status: "success",
    data: registrations,
  });
});

exports.getMyAllPersonalChatMsg = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  const personalChats = await PersonalChat.find({
    $or: [{ receiverId: userId }, { senderId: userId }],
  }).populate("replyTo");

  res.status(200).json({
    status: "success",
    data: personalChats,
  });
});

exports.fetchInvitationDetails = catchAsync(async (req, res, next) => {
  const invitationId = req.params.invitationId;

  const invitationDetails = await TeamInvite.findById(invitationId).populate(
    "communityId",
    "name image"
  );

  res.status(200).json({
    status: "success",
    data: invitationDetails,
  });
});

exports.getEventDetailsForMagicLinkPage = catchAsync(async (req, res, next) => {
  try {
    let registrationId = req.params.registrationId;

    if (registrationId.endsWith(".")) {
      console.log("Confirmed it ends with a fullstop.");
      registrationId = registrationId
        .split("")
        .reverse()
        .join("")
        .slice(1)
        .split("")
        .reverse()
        .join("");
      console.log(registrationId);
    }

    const registrationDoc = await Registration.findById(registrationId);

    if (registrationDoc) {
      const userId = registrationDoc.bookedByUser;

      const userDoc = await User.findById(userId);

      const eventId = registrationDoc.bookedForEventId;
      const userRole = registrationDoc.type;
      const userEmail = userDoc.email;
      const eventDetails = await Event.findById(eventId).populate(
        "speaker",
        "firstName lastName image"
      );

      res.status(200).json({
        status: "success",
        data: eventDetails,
        userId: userId,
        userRole: userRole,
        userEmail: userEmail,
      });
    } else {
      res.status(200).json({
        status: "failed",
        message: "Registration document was not found",
        notFound: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

exports.getSpeakerRegistrationInfoForMagicLinkPage = catchAsync(
  async (req, res, next) => {
    const registrationId = req.params.registrationId;

    const registrationDoc = await Registration.findById(registrationId);

    if (registrationDoc) {
      const eventId = registrationDoc.bookedForEventId;
      const userRole = registrationDoc.type;
      const userEmail = registrationDoc.userEmail;
      const eventDetails = await Event.findById(eventId).populate(
        "speaker",
        "firstName lastName image"
      );

      // Check if user with registered email exists

      const existingUser = await User.findOne({
        email: registrationDoc.userEmail,
      });

      if (existingUser) {
        // User is already on platform => follow normal procedure => send user details along with required event details

        const userEmail = existingUser.email;
        const userId = existingUser._id;

        // * send userIsOnBluemeet => true

        res.status(200).json({
          status: "success",
          data: eventDetails,
          userId: userId,
          userRole: userRole,
          userEmail: userEmail,
          userIsOnBluemeet: true,
        });
      } else {
        // Send that user is not registered on LetStream platform => Send event details

        // * send userIsOnBluemeet => false

        res.status(200).json({
          status: "success",
          data: eventDetails,
          userRole: userRole,
          userEmail: userEmail,
          userIsOnBluemeet: false,
        });
      }
    } else {
      res.status(200).json({
        status: "failed",
        message: "Registration document was not found",
        notFound: true,
      });
    }
  }
);

exports.getExhibitorRegistrationInfoForMagicLinkPage = catchAsync(
  async (req, res, next) => {
    const registrationId = req.params.registrationId;

    const registrationDoc = await Registration.findById(registrationId);

    if (registrationDoc) {
      const eventId = registrationDoc.bookedForEventId;
      const userRole = registrationDoc.type;
      const userEmail = registrationDoc.email;
      const eventDetails = await Event.findById(eventId).populate(
        "speaker",
        "firstName lastName image"
      );

      console.log(userEmail, "This is booth exhibitor's email");

      // Check if user with registered email exists

      const existingUser = await User.findOne({
        email: registrationDoc.userEmail,
      });

      if (existingUser) {
        const userEmail = existingUser.email;
        const userId = existingUser._id;

        // * send userIsOnBluemeet => true

        res.status(200).json({
          status: "success",
          data: eventDetails,
          userId: userId,
          userRole: userRole,
          userEmail: userEmail,
          userIsOnBluemeet: true,
        });
      } else {
        // Send that user is not registered on LetStream platform => Send event details

        // * send userIsOnBluemeet => false

        res.status(200).json({
          status: "success",
          data: eventDetails,
          userRole: userRole,
          userEmail: userEmail,
          userIsOnBluemeet: false,
        });
      }
    } else {
      res.status(200).json({
        status: "failed",
        message: "Registration document was not found",
        notFound: true,
      });
    }
  }
);

//! After user signs up then update their list of registeredEvents, registrations and update each registration doc with their userId and other userData

// Don't allow to edit email of speaker or booth  once added they can just delete previous one and add new with correct email.

exports.fetchEventTables = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  const tables = await RoomTable.find({
    eventId: mongoose.Types.ObjectId(eventId),
  });

  res.status(200).json({
    status: "success",
    data: tables,
  });
});

exports.fetchBoothTables = catchAsync(async (req, res, next) => {
  const boothId = req.params.boothId;

  const tables = await BoothTable.find({
    boothId: mongoose.Types.ObjectId(boothId),
  });

  res.status(200).json({
    status: "success",
    data: tables,
  });
});

exports.editTable = catchAsync(async (req, res, next) => {
  const tableId = req.params.tableId;

  const tableDoc = await RoomTable.findOne({ tableId: tableId });

  if (req.body.image) {
    tableDoc.image = req.body.image;
  }

  tableDoc.title = req.body.title;
  tableDoc.priority = req.body.priority;

  const updatedTable = await tableDoc.save({
    new: true,
    validateModifiedOnly: true,
  });

  res.status(200).json({
    status: "success",
    data: updatedTable,
  });
});

exports.editBoothTable = catchAsync(async (req, res, next) => {
  const tableId = req.params.tableId;

  const tableDoc = await BoothTable.findOne({ tableId: tableId });

  if (req.body.image) {
    tableDoc.image = req.body.image;
  }

  tableDoc.title = req.body.title;
  tableDoc.priority = req.body.priority;

  const updatedTable = await tableDoc.save({
    new: true,
    validateModifiedOnly: true,
  });

  res.status(200).json({
    status: "success",
    data: updatedTable,
  });
});

exports.getTableDetails = catchAsync(async (req, res, next) => {
  const tableId = req.params.tableId;

  const tableDoc = await RoomTable.findOne({ tableId: tableId });

  res.status(200).json({
    status: "success",
    data: tableDoc,
  });
});

exports.getBoothTableDetails = catchAsync(async (req, res, next) => {
  const tableId = req.params.tableId;

  const tableDoc = await BoothTable.findOne({ tableId: tableId });

  res.status(200).json({
    status: "success",
    data: tableDoc,
  });
});

exports.getTableChats = catchAsync(async (req, res, next) => {
  const tableId = req.params.tableId;

  const chats = await TableChats.find({ tableId: tableId }).populate("replyTo");

  res.status(200).json({
    status: "success",
    data: chats,
  });
});

exports.getBoothTableChats = catchAsync(async (req, res, next) => {
  const tableId = req.params.tableId;

  const chats = await BoothTableChats.find({ tableId: tableId }).populate(
    "replyTo"
  );

  res.status(200).json({
    status: "success",
    data: chats,
  });
});

exports.getBoothChats = catchAsync(async (req, res, next) => {
  const boothId = req.params.boothId;

  const chats = await BoothChats.find({
    boothId: mongoose.Types.ObjectId(boothId),
  }).populate("replyTo");

  res.status(200).json({
    status: "success",
    data: chats,
  });
});

exports.fetchSessionQnA = catchAsync(async (req, res, next) => {
  const sessionId = req.params.sessionId;

  const qnas = await SessionQnA.find({
    sessionId: mongoose.Types.ObjectId(sessionId),
  })
    .populate("askedBy")
    .populate("answeredBy");

  res.status(200).json({
    status: "success",
    data: qnas,
  });
});

exports.fetchSessionPoll = catchAsync(async (req, res, next) => {
  const sessionId = req.params.sessionId;

  const polls = await SessionPoll.find({
    sessionId: mongoose.Types.ObjectId(sessionId),
  }).populate("createdBy");

  res.status(200).json({
    status: "success",
    data: polls,
  });
});

exports.sendStageReminder = catchAsync(async (req, res, next) => {
  const sessionId = req.params.sessionId;
  const userId = req.params.userId;
  const msgToUser = req.params.msg;

  console.log(sessionId, userId, msgToUser);

  // Find user Document and

  const user = await User.findById(userId);

  // Find session Doc

  const session = await Session.findById(sessionId);

  // Subject => Reminder to join session name (Happening now)

  let Subject = `Reminder to attend ${session.name} (Happening now)`;

  const msg = {
    to: user.email, // Change to your recipient
    from: "no-reply@letstream.live", // Change to your verified sender
    subject: Subject,
    text: msgToUser,
    html: SessionReminder(),
  };

  sgMail
    .send(msg)
    .then(async () => {
      res.status(200).json({
        status: "success",
        message: "Reminder sent successfully!",
      });
    })
    .catch(async (error) => {
      res.status(400).json({
        status: "error",
        message: "Failed to send reminder. Please try again.",
      });
    });
});

exports.getEventRegistrations = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  const query = Registration.find({
    bookedForEventId: mongoose.Types.ObjectId(eventId),
  });

  const features = new apiFeatures(query, req.query).textFilter();

  const registrations = await features.query;

  res.status(200).json({
    status: "success",
    data: registrations,
  });
});

exports.resendCommunityVerificationMail = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const communityAccountRequest = await CommunityAccountRequest.findById(id);

  const msg = {
    to: communityAccountRequest.email, // Change to your recipient
    from: "security@letstream.live", // Change to your verified sender
    subject: `Verify your community mail.`,
    text: ` Congratulations on taking your first step towards managing and hosting awesome and effortless virtual and hybrid events. Please verify community by clicking on the button below. See you in. ${`https://www.letstream.live/verifying-community/${communityAccountRequest._id}`}`,
    html: VerifyCommunityEmail(
      `https://www.letstream.live/verifying-community/${communityAccountRequest._id}`
    ),
  };

  sgMail
    .send(msg)
    .then(async () => {
      console.log("Confirmation mail sent Community");
      res.status(200).json({
        status: "success",
        message: "Confirmation mail sent to Community.",
      });
    })
    .catch(async (error) => {
      console.log("Failed to send confirmation mail to Community.");
      res.status(400).json({
        status: "error",
        message: "Failed to send confirmation mail to Community.",
      });
    });
});

exports.createUserAccountRequest = catchAsync(async (req, res, next) => {
  // Check if someone already have an account with same email

  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) {
    // Send res that user already exists with this email
    res.status(200).json({
      status: "Not allowed",
      message: "There is already a verified community with this email.",
      alreadyUsedEmail: true,
    });
  } else {
    // Create a new user account request and send verification mail

    const newAccountDoc = await UserAccountRequest.create({
      status: "Not Yet Claimed",
      expired: false,
      createdAt: Date.now(),
      expiresAt: Date.now() + 14 * 24 * 60 * 60 * 1000,
      email: req.body.email,
      intent: req.body.intent,
      eventId: req.body.eventId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      referralCode: req.body.referralCode,
    });

    // Send mail for this new community

    const msg = {
      to: req.body.email, // Change to your recipient
      from: "security@letstream.live", // Change to your verified sender
      subject: `Verify your user account email.`,
      text: `Congratulations on joining LetStream platform. We are so excited to have you onboard and we can't wait to show you around. But before that we need you to please verify your email. ${`http://www.letstream.live/verifying-account/${newAccountDoc._id}`}`,
      html: VerifyUserEmail(
        `http://www.letstream.live/verifying-account/${newAccountDoc._id}`
      ),
    };

    sgMail
      .send(msg)
      .then(() => {
        res.status(200).json({
          status: "success",
          message: "verify account email sent successfully!",
          id: newAccountDoc._id,
          email: req.body.email,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(200).json({
          status: "success",
          message: "Failed to send verify account email.",
          id: newAccountDoc._id,
          email: req.body.email,
        });
      });
  }
});

exports.resendUserVerificationEmail = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const userAccountRequest = await UserAccountRequest.findById(id);

  const msg = {
    to: userAccountRequest.email, // Change to your recipient
    from: "security@letstream.live", // Change to your verified sender
    subject: `Verify your account email.`,
    text: `Congratulations on joining LetStream platform. We are so excited to have you onboard and we can't wait to show you around. But before that we need you to please verify your email. ${`http://www.letstream.live/verifying-account/${userAccountRequest._id}`}`,
    html: VerifyUserEmail(
      `http://www.letstream.live/verifying-account/${userAccountRequest._id}`
    ),
  };

  sgMail
    .send(msg)
    .then(async () => {
      console.log("Confirmation mail sent to user");
      res.status(200).json({
        status: "success",
        message: "Confirmation mail sent to user.",
      });
    })
    .catch(async (error) => {
      console.log("Failed to send confirmation mail to user.");
      res.status(400).json({
        status: "error",
        message: "Failed to send confirmation mail to user.",
      });
    });
});

exports.changeCommunityAccountRequestEmail = catchAsync(
  async (req, res, next) => {
    const id = req.params.id;
    const email = req.body.email;

    // Check if there is any existing community with same email

    const existingCommunity = await Community.findOne({ email: email });

    if (existingCommunity) {
      res.status(200).json({
        status: "Not allowed",
        message: "There is already a community registered on this email.",
        alreadyUsedEmail: true,
      });
    } else {
      // Update commmunity account request email

      const updatedCommunityAccountRequest =
        await CommunityAccountRequest.findByIdAndUpdate(
          id,
          { email: email },
          { new: true, validateModifiedOnly: true }
        );

      // Send mail to updated email
      // Send response with updated communityAccountRequest Document

      const msg = {
        to: updatedCommunityAccountRequest.email, // Change to your recipient
        from: "security@letstream.live", // Change to your verified sender
        subject: `Verify your community email.`,
        text: ` Congratulations on taking your first step towards managing and hosting awesome and effortless virtual and hybrid events. Please verify community by clicking on the button below. See you in. ${`http://www.letstream.live/verifying-community/${updatedCommunityAccountRequest._id}`}`,
        html: VerifyCommunityEmail(
          `http://www.letstream.live/verifying-community/${updatedCommunityAccountRequest._id}`
        ),
      };

      sgMail
        .send(msg)
        .then(async () => {
          console.log("Confirmation mail sent to Community");
          res.status(200).json({
            status: "success",
            data: updatedCommunityAccountRequest,
            message: "Confirmation mail sent to Community.",
          });
        })
        .catch(async (error) => {
          console.log("Failed to send confirmation mail to Community.");
          res.status(200).json({
            status: "error",
            data: updatedCommunityAccountRequest,
            message: "Failed to send confirmation mail to Community.",
          });
        });
    }
  }
);

exports.getLatestEvent = catchAsync(async (req, res, next) => {
  try {
    const communityId = req.community._id;

    // Find all events of this community sorted by date Of Creation in descending order

    let events = await Event.find({
      createdBy: mongoose.Types.ObjectId(communityId),
    }).sort({ createdAt: "desc" });

    const [latestEvent] = events;

    res.status(200).json({
      status: "success",
      data: latestEvent,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.getArchivedEvents = catchAsync(async (req, res, next) => {
  const communityId = req.params.communityId;

  // Find all events of this community which are archived

  const archivedEvents = await Event.find({
    $and: [{ communityId: communityId }, { archived: true }],
  });

  res.status(200).json({
    status: "success",
    data: archivedEvents,
  });
});

exports.duplicateEvent = catchAsync(async (req, res, next) => {
  try {
    const eventId = req.params.eventId;

    // Duplicate event with this eventId

    const originalEvent = await Event.findById(eventId);
    const communityId = originalEvent.communityId;

    const communityGettingEvent = await Community.findById(communityId);
    const document = await EventsIdsCommunityWise.findById(
      communityGettingEvent.eventsDocIdCommunityWise
    );

    const communityObject = await Community.findById(communityId).select(
      "eventManagers"
    );

    const eventManagers = communityObject.eventManagers;

    // 1.) Create a new event document with required fields

    const createdEvent = await Event.create({
      type: originalEvent.type,
      eventName: originalEvent.eventName,
      image: originalEvent.image,
      shortDescription: originalEvent.shortDescription,
      visibility: originalEvent.visibility,
      createdBy: communityId,
      communityRating: communityGettingEvent.commuintyAverageRating,
      categories: originalEvent.categories,
      startDate: Date.now(),
      endDate: Date.now() + 15 * 24 * 60 * 60 * 1000,
      startTime: Date.now(),
      endTime: Date.now() + 15 * 24 * 60 * 60 * 1000,
      socialMediaHandles: communityGettingEvent.socialMediaHandles,
      Timezone: originalEvent.Timezone,
      communityName: communityGettingEvent.name,
      communityLogo: communityGettingEvent.image,
      organisedBy: communityGettingEvent.name,
      communityId: communityGettingEvent._id,
      numberOfTablesInLounge: originalEvent.numberOfTablesInLounge,
    });

    // Initialise all tables as specified

    // Register all members of its community into this event

    // Step 1. Get all members of this community

    let members = [];

    members.push(communityGettingEvent.superAdmin);

    for (let element of eventManagers) {
      members.push(element);
    }

    // Here we have all team members ids

    for (let element of members) {
      // Fetch user document for this id and then register in this event
      await User.findById(element, async (err, doc) => {
        if (err) {
          console.log(err);
        } else {
          if (doc) {
            // User document is found. So, now we will just register this person in this event

            await Registration.create({
              type: "Host",
              status: "Completed",
              viaCommunity: true,
              eventName: originalEvent.eventName,
              userName: doc.firstName + " " + doc.lastName,
              userImage: doc.image,
              userEmail: doc.email,
              bookedByUser: doc._id,
              bookedForEventId: createdEvent._id,
              eventByCommunityId: communityId,
              createdAt: Date.now(),
              image: doc.image,
              email: doc.email,
              first_name: doc.firstName,
              last_name: doc.lastName,
              name: doc.firstName + " " + doc.lastName,
              headline: doc.headline,
              organisation: doc.organisation,
              designation: doc.designation,
              city: doc.city,
              country: doc.country,
              interests: doc.interests,
              socialMediaHandles: doc.socialMediaHandles,
              event_name: req.body.eventName,
            });
          }
        }
      });
    }

    // Here we have all team members of this community registered in this event

    for (let i = 0; i < originalEvent.numberOfTablesInLounge * 1; i++) {
      // Create tables with tableId as `${eventId}_table_${i}`
      await RoomTable.create({
        eventId: createdEvent._id,
        tableId: `${createdEvent._id}_table_${i}`,
        lastUpdatedAt: Date.now(),
      });
    }

    // Generate mux stream key --- this needs to be very very private.

    const muxRes = await Video.LiveStreams.create({
      playback_policy: "public",
      new_asset_settings: { playback_policy: "public" },
    });

    // 0) Create a registration form document for this event and store its id in this event

    const registrationForm = await RegistrationForm.create({
      initialisedAt: Date.now(),
      eventId: createdEvent._id,
    });

    createdEvent.registrationFormId = registrationForm._id;

    createdEvent.muxStreamKey = muxRes.stream_key;
    createdEvent.muxVideoPlaybackId = muxRes.playback_ids[0].id;
    createdEvent.mux_credentialId = muxRes.id;
    createdEvent.moderators = originalEvent.moderators;
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
      data: event,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.getShowcaseEvents = catchAsync(async (req, res, next) => {
  const events = await Event.find({ showOnGetStarted: true });

  res.status(200).json({
    status: "success",
    data: events,
  });
});

exports.editPayPalPayoutEmail = catchAsync(async (req, res, next) => {
  try {
    const communityId = req.body.communityId;

    const communityDoc = await Community.findById(communityId);

    const email = req.body.email;

    // Create new paypal Email change request and expire all previous ones for this community

    const allPreviousEmailChangeRequests = await PaypalEmailChange.find({
      communityId: mongoose.Types.ObjectId(communityId),
    });

    for (let element of allPreviousEmailChangeRequests) {
      await PaypalEmailChange.findByIdAndUpdate(
        element._id,
        { status: "Expired" },
        { new: true, validateModifiedOnly: true }
      );
    }

    const paypalEmailUpdateRequest = await PaypalEmailChange.create({
      communityId: communityId,
      email: email,
      createdAt: Date.now(),
      status: "Active",
    });

    communityDoc.payPalPayoutEmailId = email;

    communityDoc.paypalEmailIsVerified = false;

    const updatedCommunity = await communityDoc.save({
      new: true,
      validateModifiedOnly: true,
    });

    // Create a notification for this community and send verification mail to newly registered email

    const msg = {
      to: email, // Change to your recipient
      from: "payments@letstream.live", // Change to your verified sender
      subject: "Please verify your Paypal Payout email.",
      text: `Hi, please click on the button below to verify this email for reciving Paypal Payouts for your LetStream Community ${
        updatedCommunity.name
      }. ${`https://www.letstream.live/verify-paypal-email/${paypalEmailUpdateRequest._id}`}`,
      html: VerifyPayPalEmail(
        `https://www.letstream.live/verify-paypal-email/${paypalEmailUpdateRequest._id}`,
        updatedCommunity.name
      ),
    };

    sgMail
      .send(msg)
      .then(async () => {
        console.log("Verification mail sent to newly added email");
      })
      .catch(async (error) => {
        console.log("Failed to send verification mail to newly added email.");
      });

    // Send a alert mail to community superAdmin

    const superAdmin = communityDoc.superAdmin;
    const userDoc = await User.findById(superAdmin);
    const superAdminEmail = userDoc.email;

    const msgToSuperAdmin = {
      to: superAdminEmail, // Change to your recipient
      from: "security@letstream.live", // Change to your verified sender
      subject: "Alert!, LetStream Paypal Payout email changed.",
      text: `Hi, This is to inform you that your LetStream community ${updatedCommunity.name} Paypal Payout email has been updated to ${email}. Please verify the same through mail sent on provided email or if not done by you, then report immediately at support@letstream.live`,
      html: AlertPayoutEmailChanged(
        userDoc.firstName,
        updatedCommunity.name,
        email
      ),
    };

    sgMail
      .send(msgToSuperAdmin)
      .then(async () => {
        console.log("Confirmation mail sent to super admin email");
      })
      .catch(async (error) => {
        console.log(
          "Failed to send confirmation mail sent to super admin email"
        );
      });

    res.status(200).json({
      status: "success",
      data: updatedCommunity,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.resendPayPalEmailVerificationLink = catchAsync(
  async (req, res, next) => {
    const communityId = req.params.communityId;

    const communityDoc = await Community.findById(communityId);

    const requestObject = await PaypalEmailChange.findOne({
      $and: [
        { status: "Active" },
        { communityId: mongoose.Types.ObjectId(communityId) },
      ],
    });

    if (requestObject) {
      const msg = {
        to: requestObject.email, // Change to your recipient
        from: "payments@letstream.live", // Change to your verified sender
        subject: "Please verify your Paypal Payout email.",
        text: `Hi, please click on the button below to verify this email for reciving Paypal Payouts for your LetStream Community ${
          communityDoc.name
        }. ${`https://www.letstream.live/verify-paypal-email/${requestObject._id}`}`,
        html: VerifyPayPalEmail(
          `https://www.letstream.live/verify-paypal-email/${requestObject._id}`,
          communityDoc.name
        ),
      };

      sgMail
        .send(msg)
        .then(async () => {
          console.log("Verification mail sent to newly added email");
          res.status(200).json({
            status: "success",
          });
        })
        .catch(async (error) => {
          console.log("Failed to send verification mail to newly added email.");
          res.status(400).json({
            status: "error",
          });
        });
    } else {
      // Your mail has been verified already please refresh this page
      res.status(200).json({
        status: "success",
        emailVerified: true,
      });
    }
  }
);

exports.verifyPayPalEmail = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const requestObject = await PaypalEmailChange.findById(id);

  if (requestObject.status === "Active") {
    // Active

    // Mark this email as verified in community doc and expire this request Object

    const communityId = requestObject.communityId;

    const communityDoc = await Community.findByIdAndUpdate(
      communityId,
      { paypalEmailIsVerified: true, payPalPayoutEmailId: requestObject.email },
      { new: true, validateModifiedOnly: true }
    );

    requestObject.status = "Expired";
    await requestObject.save({ new: true, validateModifiedOnly: true });

    res.status(200).json({
      status: "success",
      succeded: true,
    });
  } else {
    // Expired

    res.status(200).json({
      status: "success",
      expired: true,
    });
  }
});

exports.createPayPalPayoutRequest = catchAsync(async (req, res, next) => {
  // Create a payout request and send a confirmation mail to verified Paypal email and super admin
  // Create a notification for community
  // Also send a mail to payouts@letstream.live to proceed with this payout handling

  // * NOTE => We also need to provide payoutId

  try {
    const communityId = req.body.communityId;
    const email = req.body.email;
    const amount = req.body.amount;

    const communityDoc = await Community.findById(communityId);

    const superAdmin = communityDoc.superAdmin;
    const userDoc = await User.findById(superAdmin);
    const superAdminEmail = userDoc.email;
    const superAdminFirstName = userDoc.firstName;

    // Make checks if requested amount is below or equal to available balance for community
    // Make sure email is verified

    // Deduct the amount from from community current balance

    if (amount * 1 <= communityDoc.amountToWithdraw) {
      if (email.toString() === communityDoc.payPalPayoutEmailId.toString()) {
        if (communityDoc.paypalEmailIsVerified) {
          // Only in this case proceed with the payout otherwise deny it

          const newPayout = await PaypalPayout.create({
            communityId: communityId,
            email: email,
            createdAt: Date.now(),
            amount: amount,
            status: "Pending",
          });

          newPayout.payoutId = newPayout._id;
          await newPayout.save({ new: true, validateModifiedOnly: true });

          communityDoc.amountToWithdraw =
            communityDoc.amountToWithdraw * 1 - amount * 1;

          await communityDoc.save({ new: true, validateModifiedOnly: true });

          // Mail to superadmin & Mail to Verified PayPal email

          const msgToSuperAdmin = {
            to: superAdminEmail, // Change to your recipient
            from: "payments@letstream.live", // Change to your verified sender
            subject: `Your payout of $${amount} is on its way.`,
            text: `Hi, This is to inform you that we have received your request for payout and we are working on that and it will be safely delivered to your paypal account associated with this email ${email} in 4-6 hours.`,
            html: PayPalPayoutOnItsWay(superAdminFirstName, amount),
          };

          sgMail
            .send(msgToSuperAdmin)
            .then(async () => {
              console.log("Confirmation mail sent to super admin email");
            })
            .catch(async (error) => {
              console.log(
                "Failed to send confirmation mail sent to super admin email"
              );
            });

          const msgToVerifiedEmail = {
            to: email, // Change to your recipient
            from: "payments@letstream.live", // Change to your verified sender
            subject: `Your payout of $${amount} is on its way.`,
            text: `Hi, This is to inform you that we have received your request for payout and we are working on that and it will be safely delivered to your paypal account associated with this email ${email} in 4-6 hours.`,
            html: PayPalPayoutOnItsWay(superAdminFirstName, amount),
          };

          sgMail
            .send(msgToVerifiedEmail)
            .then(async () => {
              console.log("Confirmation mail sent to verified paypal email");
            })
            .catch(async (error) => {
              console.log(
                "Failed to send confirmation mail sent to verified paypal email"
              );
            });

          // Mail to payout team

          const msgToPayoutTeam = {
            to: "payments@letstream.live", // Change to your recipient
            from: "omprakash.shah@letstream.live", // Change to your verified sender
            subject: `Please process payout with payout Id ${newPayout._id}`,
            text: `We have recieved a payout request with this payout Id ${newPayout._id}. Please process it ASAP with utmost care.`,
            html: ProcessPayout(communityDoc.name, newPayout._id),
          };

          sgMail
            .send(msgToPayoutTeam)
            .then(async () => {
              console.log("Info sent to Payout Team.");
            })
            .catch(async (error) => {
              console.log("Failed to send info to payout team.");
            });

          res.status(200).json({
            status: "success",
            data: newPayout,
          });
        }
      }
    } else {
      res.status(400).json({
        status: "error",
        code: "Invalid payout request",
        message:
          "Either amount specified is higher than current available balance or email is not present or verified.",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

exports.fetchPaypalPayouts = catchAsync(async (req, res, next) => {
  const communityId = req.params.communityId;

  // Fetch all payouts for this communityId

  const payouts = await PaypalPayout.find({
    communityId: mongoose.Types.ObjectId(communityId),
  });

  res.status(200).json({
    status: "success",
    data: payouts,
  });
});

exports.fetchRegistrations = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  const eventDoc = await Event.findById(eventId);

  const registrations = await Registration.find({
    bookedForEventId: mongoose.Types.ObjectId(eventId),
  }).select("type userName userEmail userImage");

  res.status(200).json({
    status: "success",
    data: registrations,
  });
});

exports.reportEvent = catchAsync(async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    const eventDoc = await Event.findById(eventId);
    const userDoc = await User.findById(userId);

    // mark event as reported and increase reported count => send a mail to report@letstream.live and SuperAdmin, community Verified mail and also create a notification for community

    const newEventReport = await Report.create({
      event: eventId,
      user: userId,
      reportedAt: Date.now(),
    });

    // Send mail to person who reported this event

    const msgToUser = {
      to: userDoc.email, // Change to your recipient
      from: "security@letstream.live", // Change to your verified sender
      subject: `We have recieved your report for following event ${eventDoc.eventName}`,
      text: `Hi, ${userDoc.firstName}, we have successfully recieved your report for the event ${eventDoc.eventName} and we are currently reviewing it. Thanks for reporting, We will take appropriate action and will reach out to you with our conclusion.`,
      html: ReportReceived(userDoc.firstName, eventDoc.eventName),
    };

    sgMail
      .send(msgToUser)
      .then(async () => {
        console.log("Confirmation sent to user.");
      })
      .catch(async (error) => {
        console.log("Failed to send confirmation to user.");
      });

    // Send a mail to event surveillance team

    const msgToSurveillanceTeam = {
      to: "security@letstream.live", // Change to your recipient
      from: "omprakash.shah@letstream.live", // Change to your verified sender
      subject: `Please review this event immediately and take appropriate action.`,
      text: `Please review event report with following Id: ${newEventReport._id}.`,
      html: PleaseReviewEvent(newEventReport._id),
    };

    sgMail
      .send(msgToSurveillanceTeam)
      .then(async () => {
        console.log("Info sent to surveillance Team.");
      })
      .catch(async (error) => {
        console.log("Failed to send info to surveillance team.");
      });

    res.status(200).json({
      status: "success",
      message:
        "This event has been successfully reported and is currently under review.",
    });
  } catch (error) {
    console.log(error);
  }
});

exports.getCoupons = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  let couponDocs = await Coupon.find({
    $and: [{ eventId: mongoose.Types.ObjectId(eventId) }, { deleted: false }],
  });

  // Also fetch all active and non-deleted tickets for this event

  const tickets = await Ticket.find({
    $and: [
      { eventId: mongoose.Types.ObjectId(eventId) },
      { active: true },
      { deleted: false },
      { soldOut: false },
    ],
  });

  res.status(200).json({
    status: "success",
    data: couponDocs,
    tickets: tickets,
  });
});

exports.getEventBooth = catchAsync(async (req, res, next) => {
  const boothId = req.params.boothId;

  const boothDoc = await Booth.findById(boothId);

  res.status(200).json({
    status: "success",
    data: boothDoc,
  });
});

exports.fetchEventReportedMessages = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  // Find all messages which were reported (populate replyTo) and combine in an array

  const eventPersonalChats = await PersonalChat.find({
    $and: [{ eventId: mongoose.Types.ObjectId(eventId) }, { reported: true }],
  }).populate("reportedBy");
  const eventNetworkingChats = await NetworkingRoomChat.find({
    $and: [{ eventId: mongoose.Types.ObjectId(eventId) }, { reported: true }],
  }).populate("reportedBy");
  const eventSessionChats = await SessionChats.find({
    $and: [{ eventId: mongoose.Types.ObjectId(eventId) }, { reported: true }],
  }).populate("reportedBy");
  const eventBoothTableChats = await BoothTableChats.find({
    $and: [{ eventId: mongoose.Types.ObjectId(eventId) }, { reported: true }],
  }).populate("reportedBy");
  const eventBoothChats = await BoothChats.find({
    $and: [{ eventId: mongoose.Types.ObjectId(eventId) }, { reported: true }],
  }).populate("reportedBy");
  const eventTableChats = await TableChats.find({
    $and: [{ eventId: mongoose.Types.ObjectId(eventId) }, { reported: true }],
  }).populate("reportedBy");
  const eventChats = await EventChatMessage.find({
    $and: [{ eventId: mongoose.Types.ObjectId(eventId) }, { reported: true }],
  }).populate("reportedBy");

  const allChats = [
    ...eventPersonalChats,
    ...eventNetworkingChats,
    ...eventSessionChats,
    ...eventBoothTableChats,
    ...eventBoothChats,
    ...eventTableChats,
    ...eventChats,
  ];

  res.status(200).json({
    status: "success",
    data: allChats,
  });
});

exports.getHighlightedSessions = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  let sessions = [];

  const eventDoc = await Event.findById(eventId);

  for (let element of eventDoc.highlightedSessions) {
    const sessionDoc = await Session.findById(element)
      .populate("host")
      .populate("speaker")
      .populate("people");
    // console.log(sessionDoc, element, "This is my debug log")
    if (sessionDoc) {
      sessions.push(sessionDoc);
    }
  }

  // console.log(sessions);

  res.status(200).json({
    status: "success",
    data: sessions,
  });
});

exports.acceptInEvent = catchAsync(async (req, res, next) => {
  // Unsuspend user and send mail to user and send confirmation to person who accepted in event

  const eventId = req.params.eventId;
  const userId = req.params.userId;

  const eventDoc = await Event.findById(eventId);

  eventDoc.blocked = eventDoc.blocked.filter(
    (uid) => uid.toString() !== userId.toString()
  );

  await eventDoc.save({ new: true, validateModifiedOnly: true });

  const acceptedUserDoc = await User.findById(userId);

  // TODO Send warning via mail and notification

  const msgToUser = {
    to: acceptedUserDoc.email, // Change to your recipient
    from: "no-reply@letstream.live", // Change to your verified sender
    subject: `You have been accepted in ${eventDoc.eventName}.`,
    text: `Here is a good news for you, You have been accepted in following event ${eventDoc.eventName}. You can now join this event by visiting your user dashboard. `,
    html: AcceptedInEvent(eventDoc.eventName),
  };

  // TODO Generate a notification for user

  sgMail
    .send(msgToUser)
    .then(async () => {
      console.log("Acceptance notification sent to user");
    })
    .catch(async (error) => {
      console.log("Failed to send acceptance notification to user.");
    });

  // Find socketId of person who accepted

  const updatedEventDoc = await Event.findById(eventId)
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
      select: "name socialMediaHandles image email superAdmin eventManagers",
    })
    .populate({
      path: "coupon",
      options: {
        match: { status: "Active" },
      },
    })
    .populate("hosts")
    .populate("people")
    .populate(
      "blocked",
      "firstName lastName email image organisation designation city country"
    );

  res.status(200).json({
    status: "success",
    data: updatedEventDoc,
  });
});

exports.resetEventLabels = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  const updatedEventDoc = await Event.findByIdAndUpdate(
    eventId,
    {
      lobbyLabel: "Lobby",
      sessionsLabel: "Sessions",
      networkingLabel: "Networking",
      loungeLabel: "Lounge",
      boothLabel: "Booth",
      feedLabel: "Feed",
      peopleLabel: "People",
      alertsLabel: "Alerts",
      moderationLabel: "Moderation",
      settingsLabel: "Settings",
    },
    { new: true, validateModifiedOnly: true }
  )
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
      select: "name socialMediaHandles image email superAdmin eventManagers",
    })
    .populate({
      path: "coupon",
      options: {
        match: { status: "Active" },
      },
    })
    .populate("hosts")
    .populate("people")
    .populate(
      "blocked",
      "firstName lastName email image organisation designation city country"
    );

  res.status(200).json({
    status: "success",
    data: updatedEventDoc,
  });
});

exports.showReview = catchAsync(async (req, res, next) => {
  const updatedReview = await Review.findByIdAndUpdate(
    req.params.reviewId,
    { hidden: false },
    { new: true, validateModifiedOnly: true }
  ).populate("user");

  res.status(200).json({
    status: "success",
    data: updatedReview,
  });
});

exports.hideReview = catchAsync(async (req, res, next) => {
  const updatedReview = await Review.findByIdAndUpdate(
    req.params.reviewId,
    { hidden: true },
    { new: true, validateModifiedOnly: true }
  ).populate("user");

  res.status(200).json({
    status: "success",
    data: updatedReview,
  });
});

exports.getPeopleOnBoothTable = catchAsync(async (req, res, next) => {
  const tableId = req.params.tableId;

  const boothTableDoc = await BoothTable.findOne({ tableId: tableId });

  let people = [];

  if (boothTableDoc) {
    for (let element of boothTableDoc.onStagePeople) {
      const userDoc = await User.findById(element.user);
      if (userDoc) {
        people.push(userDoc);
      }
    }
  }

  res.status(200).json({
    status: "success",
    data: people,
  });
});

exports.getPeopleOnLoungeTable = catchAsync(async (req, res, next) => {
  const tableId = req.params.tableId;

  const roomTableDoc = await RoomTable.findOne({ tableId: tableId });

  let people = [];

  if (roomTableDoc) {
    for (let element of roomTableDoc.onStagePeople) {
      const userDoc = await User.findById(element.user);
      if (userDoc) {
        people.push(userDoc);
      }
    }
  }

  res.status(200).json({
    status: "success",
    data: people,
  });
});

exports.getSessionSpeakersTagsTracks = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  // Session Tags , session Tracks , Session speakers

  const eventDoc = await Event.findById(eventId);

  const sessions = await Session.find({
    eventId: mongoose.Types.ObjectId(eventId),
  });

  const allTags = [];

  for (let element of sessions) {
    allTags.push(element.tags);
  }

  const [uniqTags] = Array.from(new Set(allTags));

  let processedTags = [];

  for (let item of uniqTags) {
    console.log(item);
    processedTags.push({ value: item, label: item });
  }

  const tracks = await Track.find({
    eventId: mongoose.Types.ObjectId(eventId),
  });

  const processedTracks = tracks.map((track) => {
    return {
      value: track._id,
      label: track.name,
    };
  });

  const speakers = await Speaker.find({
    eventId: mongoose.Types.ObjectId(eventId),
  });

  const processedSpeakers = speakers.map((speaker) => {
    return {
      value: speaker._id,
      label: `${speaker.firstName} ${speaker.lastName}`,
    };
  });

  res.status(200).json({
    status: "success",
    tags: processedTags,
    tracks: processedTracks,
    speakers: processedSpeakers,
  });
});

exports.getPeopleInThisSession = catchAsync(async (req, res, next) => {
  const { people } = await Session.findById(req.params.sessionId).select(
    "people"
  );

  const peopleIds = people.map((el) => el._id);

  const query = User.find({ _id: { $in: peopleIds } });

  const features = new apiFeatures(query, req.query).textFilter();

  const peopleDocs = await features.query;

  console.log(peopleDocs);

  res.status(200).json({
    status: "success",
    data: peopleDocs,
  });
});

exports.getPeopleInThisEvent = catchAsync(async (req, res, next) => {
  const { people } = await Event.findById(req.params.eventId);

  const peopleIds = people.map((el) => el._id);

  const query = User.find({ _id: { $in: peopleIds } });

  const features = new apiFeatures(query, req.query).textFilter();

  const peopleDocs = await features.query;

  console.log(peopleDocs);

  res.status(200).json({
    status: "success",
    data: peopleDocs,
  });
});

exports.getChecklistDetails = catchAsync(async (req, res, next) => {
  try {
    const eventId = req.params.eventId;

    let tickets = false;

    let videos = false;

    let vibes = false;

    let sessions = false;

    let speakers = false;

    // Get Basic details

    const eventDetails = await Event.findById(eventId);

    const basicDetails = eventDetails.basicDetailsFilled;

    // Get Tickets status

    const ticketsDoc = await Ticket.find({
      $and: [{ eventId: mongoose.Types.ObjectId(eventId) }, { deleted: false }],
    });

    if (typeof ticketsDoc !== "undefined" && ticketsDoc.length > 0) {
      tickets = true;
    }

    // Get Registration theme status

    const registrationTheme = eventDetails.registrationThemeCreated;

    // Get Event Venue Status

    const eventVenue = eventDetails.eventVenueVisited;

    // Get Videos status

    const videosDoc = await EventVideo.find({ eventId: eventId });

    if (typeof videosDoc !== "undefined" && videosDoc.length > 0) {
      videos = true;
      eventDetails.videosAdded = true;
    }

    const communityVideosDoc = await CommunityVideo.find({
      communityId: eventDetails.communityId,
    });

    for (let element of communityVideosDoc) {
      if (element.linkedToEvents.includes(eventId)) {
        videos = true;
        eventDetails.videosAdded = true;
      }
    }

    // Get Stage Vibe status

    const vibesDoc = await Vibe.find({ eventId: eventId });

    if (typeof vibesDoc !== "undefined" && vibesDoc.length > 0) {
      vibes = true;
      eventDetails.vibesAdded = true;
    }

    // Get Session status

    const sessionsDoc = await Session.find({
      $and: [
        { eventId: mongoose.Types.ObjectId(eventId) },
        { status: { $ne: "Deleted" } },
      ],
    });

    if (typeof sessionsDoc !== "undefined" && sessionsDoc.length > 0) {
      sessions = true;
      eventDetails.sessionCreated = true;
    }

    // Get Speaker status

    const speakersDoc = await Speaker.find({
      $and: [
        { eventId: mongoose.Types.ObjectId(eventId) },
        { status: { $ne: "Deleted" } },
      ],
    });

    if (typeof speakersDoc !== "undefined" && speakersDoc.length > 0) {
      speakers = true;
      eventDetails.speakerAdded = true;
    }

    // Get Integration status

    const integrations = eventDetails.integrationVisited;

    // Get Preview status

    const preview = eventDetails.previewClicked;

    await eventDetails.save({ new: true, validateModifiedOnly: true });

    res.status(200).json({
      status: "success",
      basicDetails: basicDetails,
      tickets: tickets,
      registrationTheme: registrationTheme,
      eventVenue: eventVenue,
      videos: videos,
      vibes: vibes,
      sessions: sessions,
      speakers: speakers,
      integrations: integrations,
      preview: preview,
    });
  } catch (error) {
    console.log(error);
  }
});

// exports.updateStreamingUsage = catchAsync(async (req, res, next) => {
//   const eventDoc = await Event.findById(req.params.eventId);

//   const communityId = eventDoc.communityId;

//   const communityDoc = await Community.findById(communityId);

//   console.log(req.params.duration, "This is the duration");

//   communityDoc.streamingUsedThisMonth =
//     communityDoc.streamingUsedThisMonth*1 + req.params.duration*1;

//     console.log(communityDoc.streamingUsedThisMonth, "This is updated usage")

//   await communityDoc.save({ new: true, validateModifiedOnly: true });

//   res.status(200).json({
//     status: "success",
//   });
// });

exports.uninstallHubspot = catchAsync(async (req, res, next) => {
  const communityId = req.params.communityId;

  const events = await Event.find({ communityId: communityId });

  for (let element of events) {
    element.isHubspotEnabled = false;
    await element.save({ new: true, validateModifiedOnly: true });
  }

  res.status(200).json({
    status: "success",
  });
});
exports.uninstallGoogleAnalytics = catchAsync(async (req, res, next) => {
  const communityId = req.params.communityId;

  const events = await Event.find({ communityId: communityId });

  for (let element of events) {
    element.isGoogleAnalyticsEnabled = false;
    await element.save({ new: true, validateModifiedOnly: true });
  }

  res.status(200).json({
    status: "success",
  });
});
exports.uninstallFacebookPixel = catchAsync(async (req, res, next) => {
  const communityId = req.params.communityId;

  const events = await Event.find({ communityId: communityId });

  for (let element of events) {
    element.isFacebookPixelEnabled = false;
    await element.save({ new: true, validateModifiedOnly: true });
  }

  res.status(200).json({
    status: "success",
  });
});
exports.uninstallTawk = catchAsync(async (req, res, next) => {
  const communityId = req.params.communityId;

  const events = await Event.find({ communityId: communityId });

  for (let element of events) {
    element.isTawkEnabled = false;
    await element.save({ new: true, validateModifiedOnly: true });
  }

  res.status(200).json({
    status: "success",
  });
});
exports.uninstallTypeform = catchAsync(async (req, res, next) => {
  const communityId = req.params.communityId;

  const events = await Event.find({ communityId: communityId });

  for (let element of events) {
    element.isTypeformEnabled = false;
    await element.save({ new: true, validateModifiedOnly: true });
  }

  res.status(200).json({
    status: "success",
  });
});
