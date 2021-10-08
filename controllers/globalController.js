const jwt = require("jsonwebtoken");
const Event = require("../models/eventModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const apiFeatures = require("../utils/apiFeatures");

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
const Community = require("../models/communityModel");
const StreamDestination = require("../models/streamDestinationModel");

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
      s;

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
