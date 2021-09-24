const jwt = require("jsonwebtoken");
const Event = require("../models/eventModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const apiFeatures = require("../utils/apiFeatures");

const {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} = require("agora-access-token");
const Community = require("../models/communityModel");

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
    { status: "inactive" }
  );

  const query = Event.find({
    $and: [
      { status: "active" },
      { publishedStatus: "Published" },
      { visibility: "Public" },
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
  // .paginate()
  // .textFilter()

  // .filter()
  // .categoryWiseFilter()
  // .dateWiseFilter();
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

  const appID = "4f274729f9ab45139e509eb6efba14cc";
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

  const appID = "6877e158655f4810968b19e65d0bbb23";
  const appCertificate = "8a33b9e912794ab4a78ddd5aafbc590a";

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

  const appID = "6877e158655f4810968b19e65d0bbb23";
  const appCertificate = "8a33b9e912794ab4a78ddd5aafbc590a";

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
  const channel = req.body.sessionId;
  const userId = req.user._id;
  const isPublisher = req.body.role === "host" ? true : false;

  const appID = "702d57c3092c4fd389eb7ea5a505d471";
  const appCertificate = "d8311f38cf434445805478cb8c93a334";
  const channelName = channel;
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

exports.generateLiveStreamingTokenForJoiningTable = catchAsync(
  async (req, res, next) => {
    const tableId = req.body.tableId;
    const userId = req.body.userId;
    const isPublisher = true;

    const appID = "702d57c3092c4fd389eb7ea5a505d471";
    const appCertificate = "d8311f38cf434445805478cb8c93a334";
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

exports.generateTokenForLiveStreamingForSpeaker = catchAsync(
  async (req, res, next) => {
    const channel = req.body.sessionId;
    const userId = req.body.speakerId;
    const isPublisher = req.body.role === "host" ? true : false;

    const appID = "702d57c3092c4fd389eb7ea5a505d471";
    const appCertificate = "d8311f38cf434445805478cb8c93a334";
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
    const channel = req.body.sessionId;
    const myUID = req.body.uid;

    const appID = "702d57c3092c4fd389eb7ea5a505d471";
    const appCertificate = "d8311f38cf434445805478cb8c93a334";
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
  const communityId = req.params.communityId;

  const communityDoc = await Community.findById(communityId);

  const tawkLink = communityDoc.tawkLink;

  res.status(200).json({
    data: { tawkLink: tawkLink },
    message: "success",
  });
});

exports.getAllEvents = catchAsync(async (req, res, next) => {
  console.log(req);
  const events = await Event.find({});

  res.status(200).json(events);
});
