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
const { v4: uuidv4 } = require("uuid");
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

exports.generateTokenForLiveStreamingForNonUser = catchAsync(
  async (req, res, next) => {
    const channel = req.body.sessionId;
    const userId = req.body.userId;
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

  // Check if any the provided code is already added into community if yes then reject this redemption
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
        // If total = 1 => Orgainser: 2, Mails: 2500, Storage: 15GB, Registrations: 100, Streaming: 72 hours, backdrop: true, coupons: true, mail: true, live Stream: false, integration: none, analytics: false, booth: false, sponsor: false, customisation: false, tables: upto 60
        communityDoc.isAppSumoCustomer = true;
        communityDoc.tablesLimit = 60;
        communityDoc.isAnalyticsAvailable = false;
        communityDoc.isLiveStreamingAvailable = false;
        communityDoc.availableIntegrations = "none";
        communityDoc.isCustomisationAvailable = false;
        communityDoc.isBoothAvailable = false;
        communityDoc.isSponsorAvailable = false;
        communityDoc.isCouponsAvailable = true;
        communityDoc.isBackdropAvailable = true;
        communityDoc.ticketingCharge = 7;
        communityDoc.allowedRegistrationLimit = 100;
        communityDoc.cloudStorageLimit = 15;
        communityDoc.emailLimit = 2500;
        communityDoc.streamingHoursLimit = 72;
        communityDoc.organisersLimit = 2;
        communityDoc.planName = "AppSumo";
      }
      if (totalNumOfCodes * 1 === 2) {
        // If total = 2 => Orgainser: 4, Mails: 4000, Storage: 30GB, Registrations: 250, Streaming: 72 hours, backdrop: true, coupons: true, mail: true, live Stream: true, integration: Zapier, Google Analytics, Facebook pixel, analytics: true, booth: false, sponsor: false, customisation: false, tables: upto 210

        communityDoc.isAppSumoCustomer = true;
        communityDoc.tablesLimit = 210;
        communityDoc.isAnalyticsAvailable = true;
        communityDoc.isLiveStreamingAvailable = true;
        communityDoc.availableIntegrations = "zapier google facebook";
        communityDoc.isCustomisationAvailable = false;
        communityDoc.isBoothAvailable = false;
        communityDoc.isSponsorAvailable = false;
        communityDoc.isCouponsAvailable = true;
        communityDoc.isBackdropAvailable = true;
        communityDoc.ticketingCharge = 7;
        communityDoc.allowedRegistrationLimit = 250;
        communityDoc.cloudStorageLimit = 30;
        communityDoc.emailLimit = 4000;
        communityDoc.streamingHoursLimit = 72;
        communityDoc.organisersLimit = 4;
        communityDoc.planName = "AppSumo";
      }
      if (totalNumOfCodes * 1 === 3) {
        // If total = 2 => Orgainser: 8, Mails: 8000, Storage: 60GB, Registrations: 500, Streaming: 144 hours, backdrop: true, coupons: true, mail: true, live Stream: true, integration: all, analytics: true, booth: true, sponsor: true, customisation: true, tables: upto 600

        communityDoc.isAppSumoCustomer = true;
        communityDoc.tablesLimit = 600;
        communityDoc.isAnalyticsAvailable = true;
        communityDoc.isLiveStreamingAvailable = true;
        communityDoc.availableIntegrations = "all";
        communityDoc.isCustomisationAvailable = true;
        communityDoc.isBoothAvailable = true;
        communityDoc.isSponsorAvailable = true;
        communityDoc.isCouponsAvailable = true;
        communityDoc.isBackdropAvailable = true;
        communityDoc.ticketingCharge = 7;
        communityDoc.allowedRegistrationLimit = 500;
        communityDoc.cloudStorageLimit = 60;
        communityDoc.emailLimit = 8000;
        communityDoc.streamingHoursLimit = 144;
        communityDoc.organisersLimit = 8;
        communityDoc.planName = "AppSumo";
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

      //* Now send a mail to community admin and person who applied code that the process was successful. Enjoy Bluemeet and have a good day ahead. Thanks for embarking on this journey with us. See you soon.

      const mailsArray = [communityDoc.superAdminEmail, userDoc.email];

      for (let element of mailsArray) {
        const msg = {
          to: element, // Change to your recipient
          from: "shreyanshshah242@gmail.com", // Change to your verified sender
          subject: "AppSumo codes redeemed!",
          text: `${totalNumOfCodes} Codes have been successfully applied to your Bluemeet Community. ${communityDoc.name}.`,
          // html: TeamInviteTemplate(urlToBeSent, communityDoc, userDoc),
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

  // TODO Send a mail to a bluemeet person saying that someone has requested an integration

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

  // TODO Send a mail to a bluemeet person saying that someone has proposed an integration

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
  const appID = "702d57c3092c4fd389eb7ea5a505d471";
  const appCertificate = "d8311f38cf434445805478cb8c93a334";
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
              maxIdleTime: 30,
              streamTypes: 2,
              channelType: 0,
              transcodingConfig: {
                height: 640,
                width: 360,
                bitrate: 500,
                fps: 15,
                mixedVideoLayout: 1,
                backgroundColor: "#FF0000",
              },
              subscribeVideoUids: ["123", "456"],
              subscribeAudioUids: ["123", "456"],
              subscribeUidGroup: 0,
            },
            recordingFileConfig: {
              avFileType: ["hls"],
            },
            storageConfig: {
              accessKey: "AKIA476PXBEVI6FHBGWC",
              region: 2,
              bucket: "bluemeet",
              secretKey: "o9fN3IeJOdBEvUlZ0mEjXkVMz8d4loxp/nY5YXhb",
              vendor: 1,
              fileNamePrefix: ["directory1", "directory2"],
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

    // res.status(200).json({
    //   status: "success",
    //   data: startResult,
    // });

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
          async_stop: false,
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

  res.status(200).json({
    status: "success",
    data: speakers,
  });
});

exports.getPeopleInEvent = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  const peopleInEvent = await Event.findById(eventId)
    .select("currentlyInEvent")
    .populate({
      path: "currentlyInEvent",
      options: {
        match: { status: "Active" },
      },
    });

  res.status(200).json({
    status: "success",
    data: peopleInEvent,
  });
});

exports.getMyAllPersonalChatMsg = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  const personalChats = await PersonalChat.find({
    $or: [{ recieverId: userId }, { senderId: userId }],
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
  const registrationId = req.params.registrationId;

  const registrationDoc = await Registration.findById(registrationId);

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
});

exports.getSpeakerRegistrationInfoForMagicLinkPage = catchAsync(
  async (req, res, next) => {
    const registrationId = req.params.registrationId;

    const registrationDoc = await Registration.findById(registrationId);
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
      // Send that user is not registered on Bluemeet platform => Send event details

      // * send userIsOnBluemeet => false

      res.status(200).json({
        status: "success",
        data: eventDetails,
        userRole: userRole,
        userEmail: userEmail,
        userIsOnBluemeet: false,
      });
    }
  }
);

//! After user signs up then update their list of registeredEvents, registrations and update each registration doc with their userId and other userData

// Don't allow to edit email of speaker or booth  once added they can just delete previous one and add new with correct email.
