const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const LoggedInUsers = require("./models/loggedInUsers");
const MailList = require("./models/emailListModel");
const TableChats = require("./models/tableChatsModel");
const BoothChats = require("./models/boothChatsModel");
const BoothTableChats = require("./models/boothTableChatsModel");
const PersonalChat = require("./models/PersonalChatModel");
const ScheduledMeet = require("./models/scheduledMeetModel");
const Registration = require("./models/registrationsModel");
const ConnectionRequest = require("./models/connectionRequestModel");
const NetworkingRoomChats = require("./models/NetworkingRoomChatsModel");
const SessionPoll = require("./models/sessionPollModel");
const SessionQnA = require("./models/sessionQnAModel");
const TeamInvite = require("./models/teamInviteModel");
const Community = require("./models/communityModel");
const BoothTable = require("./models/boothTableModel");
const BoothChair = require("./models/boothChairModel");
const Booth = require("./models/boothModel");
const Speaker = require("./models/speakerModel");
const NetworkingRoom = require("./models/networkingRoomModel");
const Recording = require("./models/recordingModel");
const { nanoid } = require("nanoid");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);

var btoa = require("btoa");

const {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} = require("agora-access-token");

process.on("uncaughtException", (err) => {
  console.log(err);
  console.log("UNCAUGHT Exception! Shutting down ...");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const cors = require("cors");
const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://127.0.0.1:3001",
      "http://localhost:3001",
      "https://www.bluemeet.in",
      "https://bluemeet.in",
      "https://zapier.com",
      "https://www.zapier.com",
    ],
    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
  },
});

const Event = require("./models/eventModel");
const User = require("./models/userModel");

const lobbyController = require("./controllers/lobbyController");
const UsersInEvent = require("./models/usersInEventModel");
const UsersInSession = require("./models/usersInSessionModel");
const Session = require("./models/sessionModel");
const RoomChair = require("./models/roomChairModel");
const RoomTable = require("./models/roomTableModel");
const EventChatMessage = require("./models/eventChatMessageModel");
const SessionChatMessage = require("./models/sessionChatMessageModel");
const SessionBackstageMessage = require("./models/sessionBackstageModel");
const EventAlert = require("./models/eventAlertsModel");
const EventPoll = require("./models/eventPollModel");
const AvailableForNetworking = require("./models/availableForNetworking");
const YouHaveBeenSuspended = require("./Mail/YouHaveBeenSuspended");
const AcceptedInEvent = require("./Mail/AcceptedInEvent");
const YouHaveAWarning = require("./Mail/YouHaveAWarning");
const WelcomeToBluemeet = require("./Mail/WelcomeToBluemeet");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DB Connection successful");
  });

const port = process.env.PORT || 8000;
const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

io.on("connect", (socket) => {
  socket.on(
    "suspendOnly",
    async ({ eventId, userId, senderId, warning }, callback) => {
      // Suspend user logout user mail user and send confirmation to person who suspended

      // Make sure user is not in event block list already
      const eventDoc = await Event.findById(eventId);

      eventDoc.blocked = eventDoc.blocked.filter(
        (user) => user.toString() !== senderId.toString()
      );

      eventDoc.blocked.push(senderId);

      await eventDoc.save({ new: true, validateModifiedOnly: true });

      const BlockedPersonEventDoc = await UsersInEvent.findOne({
        $and: [
          { room: mongoose.Types.ObjectId(eventId) },
          { userId: mongoose.Types.ObjectId(senderId) },
        ],
      });

      const blockedUserDoc = await User.findById(senderId);

      // TODO Send warning via mail and notification

      const msgToUser = {
        to: blockedUserDoc.email, // Change to your recipient
        from: "", // Change to your verified sender
        subject: `You have been suspended from ${eventDoc.eventName}`,
        text: `You have been suspended from ${eventDoc.eventName}. Here is what event organisers have to say about this ${warning}`,
        html: YouHaveBeenSuspended(),
      };

      // TODO Generate a notification for user

      sgMail
        .send(msgToUser)
        .then(async () => {
          console.log("Suspension notification sent to user");
        })
        .catch(async (error) => {
          console.log("Failed to send suspension notification to user.");
        });

      const blockedUserSocket = BlockedPersonEventDoc.socketId; // ! Socket Id of suspended person

      io.to(blockedUserSocket).emit("youHaveBeenSuspended");

      // Find socketId of person who suspended

      const AdminDoc = await UsersInEvent.findOne({
        $and: [
          { room: mongoose.Types.ObjectId(eventId) },
          { userId: mongoose.Types.ObjectId(userId) },
        ],
      });

      const adminSocket = AdminDoc.socketId; // ! Socket Id of admin

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
          select:
            "name socialMediaHandles image email superAdmin eventManagers",
        })
        .populate({
          path: "coupon",
          options: {
            match: { status: "Active" },
          },
        })
        .populate("hosts")
        .populate("people");

      io.to(adminSocket).emit("suspendedSuccessfully", {
        updatedEvent: updatedEventDoc,
      });
    }
  );

  socket.on("acceptInEvent", async ({ userId, myId, eventId }, callback) => {
    // Unsuspend user and send mail to user and send confirmation to person who accepted in event

    const eventDoc = await Event.findById(eventId);

    eventDoc.blocked = eventDoc.blocked.filter(
      (uid) => uid.toString() !== userId.toString()
    );

    await eventDoc.save({ new: true, validateModifiedOnly: true });

    const UserDoc = await UsersInEvent.findOne({
      $and: [
        { room: mongoose.Types.ObjectId(eventId) },
        { userId: mongoose.Types.ObjectId(userId) },
      ],
    });

    const acceptedUserDoc = await User.findById(userId);

    // TODO Send warning via mail and notification

    const msgToUser = {
      to: acceptedUserDoc.email, // Change to your recipient
      from: "shreyanshshah242@gmail.com", // Change to your verified sender
      subject: `You have been accepted in ${eventDoc.eventName}.`,
      text: `Here is a good news for you, You have been accepted in following event ${eventDoc.eventName}. You can now join this event by visiting your user dashboard. `,
      html: AcceptedInEvent(),
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

    const AdminDoc = await UsersInEvent.findOne({
      $and: [
        { room: mongoose.Types.ObjectId(eventId) },
        { userId: mongoose.Types.ObjectId(myId) },
      ],
    });

    const adminSocket = AdminDoc.socketId; // ! Socket Id of admin

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
      .populate("people");

    io.to(adminSocket).emit("acceptedSuccessfully", {
      updatedEvent: updatedEventDoc,
    });
  });

  socket.on(
    "suspendFromEvent",
    async ({ msgId, eventId, warning, userId }, callback) => {
      // Add to user event blocked list
      // Send warning message via email and notification
      // Send confirmation to user who suspended this person

      let msg;

      const personalMsg = await PersonalChat.findByIdAndUpdate(msgId, {
        suspended: true,
      });
      const tableMsg = await TableChats.findByIdAndUpdate(msgId, {
        suspended: true,
      });
      const boothMsg = await BoothChats.findByIdAndUpdate(msgId, {
        suspended: true,
      });
      const boothTableMsg = await BoothTableChats.findByIdAndUpdate(msgId, {
        suspended: true,
      });
      const eventMsg = await EventChatMessage.findByIdAndUpdate(msgId, {
        suspended: true,
      });
      const sessionMsg = await SessionChatMessage.findByIdAndUpdate(msgId, {
        suspended: true,
      });
      const networkingMsg = await NetworkingRoomChats.findByIdAndUpdate(msgId, {
        suspended: true,
      });

      if (personalMsg) {
        msg = personalMsg;
      }
      if (tableMsg) {
        msg = tableMsg;
      }
      if (boothMsg) {
        msg = boothMsg;
      }
      if (boothTableMsg) {
        msg = boothTableMsg;
      }
      if (eventMsg) {
        msg = eventMsg;
      }
      if (sessionMsg) {
        msg = sessionMsg;
      }
      if (networkingMsg) {
        msg = networkingMsg;
      }

      let msgSentBy;

      if (msg.userId) {
        msgSentBy = msg.userId;
      }
      if (msg.senderId) {
        msgSentBy = msg.senderId;
      }

      // Make sure user is not in event block list already
      const eventDoc = await Event.findById(eventId);

      eventDoc.blocked = eventDoc.blocked.filter(
        (user) => user.toString() !== msgSentBy.toString()
      );

      eventDoc.blocked.push(msgSentBy);

      await eventDoc.save({ new: true, validateModifiedOnly: true });

      // Find socketId of msgSender

      const MsgSenderDoc = await UsersInEvent.findOne({
        $and: [
          { room: mongoose.Types.ObjectId(eventId) },
          { userId: mongoose.Types.ObjectId(msgSentBy) },
        ],
      });

      const msgSenderUserDoc = await User.findById(msgSentBy);

      msg.suspended = true;
      await msg.save({ new: true, validateModifiedOnly: true });

      // TODO Send warning via mail and notification

      const msgToUser = {
        to: msgSenderUserDoc.email, // Change to your recipient
        from: "shreyanshshah242@gmail.com", // Change to your verified sender
        subject: `You have been suspended from ${eventDoc.eventName}`,
        text: `You have been suspended from ${eventDoc.eventName}. Here is what event organisers have to say about this ${warning}`,
        html: YouHaveBeenSuspended(),
      };

      // TODO Generate a notification for user

      sgMail
        .send(msgToUser)
        .then(async () => {
          console.log("Suspension notification sent to user");
        })
        .catch(async (error) => {
          console.log("Failed to send suspension notification to user.");
        });

      const msgSenderSocket = MsgSenderDoc.socketId; // ! Socket Id of MsgSender

      io.to(msgSenderSocket).emit("youHaveBeenSuspended");

      // Find socketId of person who suspended

      const UserDoc = await UsersInEvent.findOne({
        $and: [
          { room: mongoose.Types.ObjectId(eventId) },
          { userId: mongoose.Types.ObjectId(userId) },
        ],
      });

      const userSocket = UserDoc.socketId; // ! Socket Id of user

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
          select:
            "name socialMediaHandles image email superAdmin eventManagers",
        })
        .populate({
          path: "coupon",
          options: {
            match: { status: "Active" },
          },
        })
        .populate("hosts")
        .populate("people");

      io.to(userSocket).emit("suspendedSuccessfully", {
        updatedEvent: updatedEventDoc,
      });
    }
  );

  socket.on("warn", async ({ msgId, eventId, warning, userId }, callback) => {
    // Send warning message via email and notification
    // Send confirmation to user who warned this person

    let msg;

    const personalMsg = await PersonalChat.findByIdAndUpdate(msgId, {
      warned: true,
    });
    const tableMsg = await TableChats.findByIdAndUpdate(msgId, {
      warned: true,
    });
    const boothMsg = await BoothChats.findByIdAndUpdate(msgId, {
      warned: true,
    });
    const boothTableMsg = await BoothTableChats.findByIdAndUpdate(msgId, {
      warned: true,
    });
    const eventMsg = await EventChatMessage.findByIdAndUpdate(msgId, {
      warned: true,
    });
    const sessionMsg = await SessionChatMessage.findByIdAndUpdate(msgId, {
      warned: true,
    });
    const networkingMsg = await NetworkingRoomChats.findByIdAndUpdate(msgId, {
      warned: true,
    });

    if (personalMsg) {
      msg = personalMsg;
    }
    if (tableMsg) {
      msg = tableMsg;
    }
    if (boothMsg) {
      msg = boothMsg;
    }
    if (boothTableMsg) {
      msg = boothTableMsg;
    }
    if (eventMsg) {
      msg = eventMsg;
    }
    if (sessionMsg) {
      msg = sessionMsg;
    }
    if (networkingMsg) {
      msg = networkingMsg;
    }

    let msgSentBy;

    if (msg.userId) {
      msgSentBy = msg.userId;
    }
    if (msg.senderId) {
      msgSentBy = msg.senderId;
    }

    // Find socketId of msgSender

    const MsgSenderDoc = await UsersInEvent.findOne({
      $and: [
        { room: mongoose.Types.ObjectId(eventId) },
        { userId: mongoose.Types.ObjectId(msgSentBy) },
      ],
    });

    const msgSenderUserDoc = await User.findById(msgSentBy);

    const eventDoc = await Event.findById(eventId);

    msg.warned = true;
    await msg.save({ new: true, validateModifiedOnly: true });

    // TODO Send warning via mail and notification

    const msgToUser = {
      to: msgSenderUserDoc.email, // Change to your recipient
      from: "shreyanshshah242@gmail.com", // Change to your verified sender
      subject: `You have a warning from ${eventDoc.eventName}`,
      text: YouHaveAWarning(),
      // html: TeamInviteTemplate(urlToBeSent, communityDoc, userDoc),
    };

    // TODO Generate a notification for user

    sgMail
      .send(msgToUser)
      .then(async () => {
        console.log("Warning notification sent to user");
      })
      .catch(async (error) => {
        console.log("Failed to send warning notification to user.");
      });

    const msgSenderSocket = MsgSenderDoc.socketId; // ! Socket Id of MsgSender

    io.to(msgSenderSocket).emit("youAreWarned", { warning });

    // Find socketId of person who suspended

    const UserDoc = await UsersInEvent.findOne({
      $and: [
        { room: mongoose.Types.ObjectId(eventId) },
        { userId: mongoose.Types.ObjectId(userId) },
      ],
    });

    const userSocket = UserDoc.socketId; // ! Socket Id of user

    io.to(userSocket).emit("warnedSuccessfully");
  });

  socket.on(
    "deleteReportedMsg",
    async ({ userId, msgId, eventId }, callback) => {
      // delete msg and send confirmation to user who deleted this message

      const personalMsg = await PersonalChat.findByIdAndUpdate(msgId, {
        deleted: true,
      });
      const tableMsg = await TableChats.findByIdAndUpdate(msgId, {
        deleted: true,
      });
      const boothMsg = await BoothChats.findByIdAndUpdate(msgId, {
        deleted: true,
      });
      const boothTableMsg = await BoothTableChats.findByIdAndUpdate(msgId, {
        deleted: true,
      });
      const eventMsg = await EventChatMessage.findByIdAndUpdate(msgId, {
        deleted: true,
      });
      const sessionMsg = await SessionChatMessage.findByIdAndUpdate(msgId, {
        deleted: true,
      });
      const networkingMsg = await NetworkingRoomChats.findByIdAndUpdate(msgId, {
        deleted: true,
      });

      const UserDoc = await UsersInEvent.findOne({
        $and: [
          { room: mongoose.Types.ObjectId(eventId) },
          { userId: mongoose.Types.ObjectId(userId) },
        ],
      });

      const userSocket = UserDoc.socketId; // ! Socket Id of user

      io.to(userSocket).emit("deletedSuccessfully");
    }
  );

  socket.on(
    "reportMsg",
    async ({ msgId, userId, eventId, reason, msgType }, callback) => {
      let reportedMsg;

      // Msg Type can be networking, event, private, table, session, booth, boothTable,

      // Find msg and mark as reported

      switch (msgType) {
        case "event":
          reportedMsg = await EventChatMessage.findByIdAndUpdate(
            msgId,
            { reported: true, reportReason: reason, reportedBy: userId },
            { new: true, validateModifiedOnly: true }
          ).populate("replyTo");
          break;
        case "private":
          reportedMsg = await PersonalChat.findByIdAndUpdate(
            msgId,
            { reported: true, reportReason: reason, reportedBy: userId },
            { new: true, validateModifiedOnly: true }
          ).populate("replyTo");
          break;
        case "networking":
          reportedMsg = await NetworkingRoomChats.findByIdAndUpdate(
            msgId,
            { reported: true, reportReason: reason, reportedBy: userId },
            { new: true, validateModifiedOnly: true }
          ).populate("replyTo");
          break;
        case "session":
          reportedMsg = await SessionChatMessage.findByIdAndUpdate(
            msgId,
            { reported: true, reportReason: reason, reportedBy: userId },
            { new: true, validateModifiedOnly: true }
          ).populate("replyTo");
          break;
        case "boothTable":
          reportedMsg = await BoothTableChats.findByIdAndUpdate(
            msgId,
            { reported: true, reportReason: reason, reportedBy: userId },
            { new: true, validateModifiedOnly: true }
          ).populate("replyTo");
          break;
        case "booth":
          reportedMsg = await BoothChats.findByIdAndUpdate(
            msgId,
            { reported: true, reportReason: reason, reportedBy: userId },
            { new: true, validateModifiedOnly: true }
          ).populate("replyTo");
          break;
        case "table":
          reportedMsg = await TableChats.findByIdAndUpdate(
            msgId,
            { reported: true, reportReason: reason, reportedBy: userId },
            { new: true, validateModifiedOnly: true }
          ).populate("replyTo");
          break;

        default:
          break;
      }

      // Find socket Id of person who reported and send a confirmation to him / her

      const UserDoc = await UsersInEvent.findOne({
        $and: [
          { room: mongoose.Types.ObjectId(eventId) },
          { userId: mongoose.Types.ObjectId(userId) },
        ],
      });

      const userSocket = UserDoc.socketId; // ! Socket Id of user

      io.to(userSocket).emit("reportedSuccessfully");

      // Emit event to everyone in this event

      io.in(eventId).emit("msgReported", {
        reportedMsg: reportedMsg,
        msgType: msgType,
      });
    }
  );

  socket.on("startCloudRecording", async ({ sessionId }, callback) => {
    const channelName = sessionId;
    const isPublisher = false;
    const appID = "915628d494484dac856cba48faa55ccb";
    const appCertificate = "80ef99da3c6642efb17adcbb29a663a9";
    const role = isPublisher ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    const expirationTimeInSeconds = 3600;

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Build token with uid
    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      "52787172",
      role,
      privilegeExpiredTs
    );

    console.log("Channel name", channelName, "915628d494484dac856cba48faa55ccb");

    const customerKey = "4191a4f5b2da4c3b8736663520c1c61e";
    // Customer secret
    const customerSecret = "16eac8d5d6f141a59e6a2b39d234c08e";

    // Concatenate customer key and customer secret and use base64 to encode the concatenated string
    const plainCredential = customerKey + ":" + customerSecret;

    // Encode with base64
    encodedCredential = btoa(plainCredential);

    try {
      const response = await fetch(
        `https://api.agora.io/v1/apps/915628d494484dac856cba48faa55ccb/cloud_recording/acquire`,
        {
          method: "POST",

          body: JSON.stringify({
            cname: channelName,
            uid: "52787172",
            clientRequest: {},
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${encodedCredential}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const result = await response.json();

      const startResponse = await fetch(
        `https://api.agora.io/v1/apps/915628d494484dac856cba48faa55ccb/cloud_recording/resourceid/${result.resourceId}/mode/mix/start`,
        {
          method: "POST",

          body: JSON.stringify({
            uid: "52787172",
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
                bucket: "bluemeet-inc",
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
        // res.status(400).json({
        //   status: "error",
        //   message: "Failed to start recording.",
        //   res: startResponse,
        // });

        throw new Error("Something went wrong");
      }

      const startResult = await startResponse.json();

      console.log(startResult);

      await Session.findByIdAndUpdate(channelName, {
        resourceId: startResult.resourceId,
        sid: startResult.sid,
      });

      const sessionDoc = await Session.findById(sessionId);
      const resourceId = sessionDoc.resourceId;
      const sid = sessionDoc.sid;

      const queryresponse = await fetch(
        `https://api.agora.io/v1/apps/915628d494484dac856cba48faa55ccb/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/query`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${encodedCredential}`,
          },
        }
      );

      if (!queryresponse.ok) {
        // res.status(400).json({
        //   status: "error",
        //   message: "Failed to fetch recording status.",
        //   res: queryresponse,
        // });

        throw new Error("Something went wrong");
      } else {
        const result = await queryresponse.json();

        console.log(result, "This is the result of querying recording status.");

        //  ! emeit message to everyone in session that recording has been started

        await Session.findByIdAndUpdate(
          sessionId,
          { recording: true },
          { new: true, validateModifiedOnly: true }
        );

        const updatedSession = await Session.findById(sessionId)
          .populate("host")
          .populate("speaker")
          .populate("people");

        io.in(sessionId).emit("recordingStarted", {
          session: updatedSession,
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("stopCloudRecording", async ({ sessionId }, callback) => {
    const sessionDoc = await Session.findById(sessionId);
    const resourceId = sessionDoc.resourceId;
    const sid = sessionDoc.sid;

    const customerKey = "4191a4f5b2da4c3b8736663520c1c61e";
    // Customer secret
    const customerSecret = "16eac8d5d6f141a59e6a2b39d234c08e";

    // Concatenate customer key and customer secret and use base64 to encode the concatenated string
    const plainCredential = customerKey + ":" + customerSecret;

    // Encode with base64
    encodedCredential = btoa(plainCredential);

    const response = await fetch(
      `https://api.agora.io/v1/apps/915628d494484dac856cba48faa55ccb/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/stop`,
      {
        method: "POST",

        body: JSON.stringify({
          cname: sessionId,
          uid: "52787172",
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
      // res.status(400).json({
      //   status: "error",
      //   message: "Failed to stop recording.",
      //   res: response,
      // });

      throw new Error("Something went wrong");
    } else {
      const result = await response.json();

      console.log(result, "This is the result of stopping cloud recording.");

      // Here save recorded file in recording array of this event

      console.log(
        `${result.serverResponse.fileList[0].fileName.replace(
          /.m3u8/g,
          "_0.mp4"
        )}`
      );

      const sessionDoc = await Session.findByIdAndUpdate(
        sessionId,
        { recording: false },
        { new: true, validateModifiedOnly: true }
      );

      await Recording.create({
        eventId: sessionDoc.eventId,
        sessionId: sessionId,
        sessionName: sessionDoc.name,
        url: `${result.serverResponse.fileList[0].fileName.replace(
          /.m3u8/g,
          "_0.mp4"
        )}`,
        timestamp: Date.now(),
      });

      const updatedSession = await Session.findById(sessionId)
        .populate("host")
        .populate("speaker")
        .populate("people");

      // ! emit message to everyone that recording has been stopped

      // recordingStopped

      io.in(sessionId).emit("recordingStopped", {
        session: updatedSession,
      });
    }
  });

  socket.on("raiseHand", async ({ userId, sessionId }, callback) => {
    // Find user doc and add to sessions raised hands queue

    console.log(userId, sessionId);
    if ((userId, sessionId)) {
      const userDoc = await User.findById(userId);

      const sessionDoc = await Session.findById(sessionId);

      // // Make sure this user is not already present in raised Hands queue

      sessionDoc.raisedHands = sessionDoc.raisedHands.filter(
        (person) =>
          person.userId.toString() !== userId.toString() && person.userId
      );

      await sessionDoc.save({ new: true, validateModifiedOnly: true });

      // Now add this person to the queue
      if (userId && userDoc) {
        sessionDoc.raisedHands.push({
          userId: userId,
          userName: `${userDoc.firstName} ${userDoc.lastName}`,
          userEmail: userDoc.email,
          userImage: userDoc.image,
          userOrganisation: userDoc.organisation,
          userDesignation: userDoc.designation,
          isOnStage: false,
          raisedAt: Date.now(),
        });
      }

      await sessionDoc.save({ new: true, validateModifiedOnly: true });

      const updatedSession = await Session.findById(sessionId)
        .populate("host")
        .populate("speaker")
        .populate("people");

      io.in(sessionId).emit("raisedHand", {
        session: updatedSession,
        userName: `${userDoc.firstName} ${userDoc.lastName}`,
      }); // New Event name because we will show a push notification to host that someone just raised hand
    }
  });

  socket.on(
    "rejectMicRequest",
    async ({ userId, eventId, sessionId }, callback) => {
      // Just remove this user from ordered queue of raised hands and send updated session to everyone in this session

      const sessionDoc = await Session.findById(sessionId);

      sessionDoc.raisedHands = sessionDoc.raisedHands.filter(
        (person) =>
          person.userId.toString() !== userId.toString() && person.userId
      );

      await sessionDoc.save({ new: true, validateModifiedOnly: true });

      const updatedSession = await Session.findById(sessionId)
        .populate("host")
        .populate("speaker")
        .populate("people");

      io.in(sessionId).emit("updatedSession", {
        updatedSession: updatedSession,
        userName: `${userDoc.firstName} ${userDoc.lastName}`,
      });
    }
  );

  socket.on("putOnStage", async ({ userId, eventId, sessionId }, callback) => {
    // Just change isOnStage => true and ask user to come on stage

    const sessionDoc = await Session.findById(sessionId);

    const thisUserInRaisedHandsQueue = sessionDoc.raisedHands.find(
      (person) => person.userId.toString() == userId.toString()
    );

    thisUserInRaisedHandsQueue.isOnStage = true;

    await sessionDoc.save({ new: true, validateModifiedOnly: true });

    // Find this users socketId and ask him/her to come on stage

    const UserDoc = await UsersInEvent.findOne({
      $and: [
        { room: mongoose.Types.ObjectId(eventId) },
        { userId: mongoose.Types.ObjectId(userId) },
      ],
    });

    const userSocket = UserDoc.socketId; // ! Socket Id of user who is to be invited on stage

    io.to(userSocket).emit("invitedToStage"); // Following this => this user will be promoted to stage

    const updatedSession = await Session.findById(sessionId)
      .populate("host")
      .populate("speaker")
      .populate("people");

    io.in(sessionId).emit("updatedSession", { updatedSession: updatedSession });
  });

  socket.on(
    "removeFromStage",
    async ({ userId, eventId, sessionId }, callback) => {
      // This can be called by either user itself or host
      // Find user in raised Hands Queue and remove from it and tell user to leaveStage

      const sessionDoc = await Session.findById(sessionId);

      // Make sure this user is not already present in raised Hands queue

      sessionDoc.raisedHands = sessionDoc.raisedHands.filter(
        (person) => person.userId.toString() !== userId.toString()
      );

      await sessionDoc.save({ new: true, validateModifiedOnly: true });

      // Find this users socketId and ask him/her to leave stage

      const UserDoc = await UsersInEvent.findOne({
        $and: [
          { room: mongoose.Types.ObjectId(eventId) },
          { userId: mongoose.Types.ObjectId(userId) },
        ],
      });

      const userSocket = UserDoc.socketId; // ! Socket Id of user who is to be demoted from stage

      io.to(userSocket).emit("leaveStage"); // Following this => this user will be demoted from stage

      const updatedSession = await Session.findById(sessionId)
        .populate("host")
        .populate("speaker")
        .populate("people");

      io.in(sessionId).emit("updatedSession", {
        updatedSession: updatedSession,
      });
    }
  );

  socket.on("thumbsUp", async ({ sessionId }) => {
    socket.to(sessionId).emit("thumbsUp");
  });
  socket.on("clap", async ({ sessionId }) => {
    socket.to(sessionId).emit("clap");
  });
  socket.on("smile", async ({ sessionId }) => {
    socket.to(sessionId).emit("smile");
  });

  socket.on("emoji", async ({ sessionId, emoji }) => {
    socket.to(sessionId).emit("emoji", {
      emoji: emoji,
    });
  });

  socket.on("joinBooth", async ({ boothId }, callback) => {
    socket.join(boothId);
    console.log("This is join Booth");
  });

  socket.on("leaveBooth", async ({ boothId }, callback) => {
    socket.leave(boothId);
    console.log("This is leave Booth");
  });

  socket.on(
    "joinNetworking",
    async ({ room, userId, eventId, userRole }, callback) => {
      // Join the room
      socket.join(room); // User has joined the networking room

      // TODO Add this person to onStagePeople of this networkingRoom and send updated networkingRoomDetails in this room
      const networkingRoom = await NetworkingRoom.findOne({ roomId: room });

      networkingRoom.joinedByUsers.push(userId);

      networkingRoom.onStagePeople.push({
        user: userId,
        role: userRole,
        camera: false,
        microphone: false,
        screen: false,
      });

      await networkingRoom.save(
        { new: true, validateModifiedOnly: true },
        (err, updatedNetworkingRoom) => {
          if (err) {
            console.log(err);
          } else {
            io.in(room).emit("updatedNetworkingRoom", {
              updatedNetworkingRoom: updatedNetworkingRoom,
            });
          }
        }
      );

      // Find socket Id of this user

      const { socketId } = await UsersInEvent.findOne({
        $and: [
          { room: mongoose.Types.ObjectId(eventId) },
          { userId: mongoose.Types.ObjectId(userId) },
        ],
      }).select("socketId");

      // Send chat messages for this room to person who just joined (if any)

      const chats = await NetworkingRoomChats.find({ roomId: room });

      io.to(socketId).emit("networkingChat", {
        chats: chats,
      });
    }
  );

  socket.on("leaveNetworking", async ({ eventId, userId, room }, callback) => {
    // Remove this user from available for networking people in this event

    // TODO Remove this person from onStagePeople of this networkingRoom and send updated networkingRoomDetails in this room

    const networkingRoom = await NetworkingRoom.findOne({ roomId: room });

    if (networkingRoom) {
      networkingRoom.onStagePeople = networkingRoom.onStagePeople.filter(
        (person) => person.user.toString() !== userId.toString()
      );

      await networkingRoom.save(
        { new: true, validateModifiedOnly: true },
        (err, updatedNetworkingRoom) => {
          if (err) {
            console.log(err);
          } else {
            io.in(room).emit("updatedNetworkingRoom", {
              updatedNetworkingRoom: updatedNetworkingRoom,
            });

            socket.leave(room);
          }
        }
      );
    }

    const doc = await AvailableForNetworking.findOne({
      $and: [
        { eventId: mongoose.Types.ObjectId(eventId) },
        { userId: mongoose.Types.ObjectId(userId) },
      ],
    });

    if (doc) {
      if (doc._id) {
        await AvailableForNetworking.findByIdAndDelete(doc._id);
      }
    }

    if (room) {
      socket.leave(room);
    }
  });

  socket.on(
    "transmitNetworkingMessage",
    async (
      {
        isReply,
        replyTo,
        textMessage,
        roomId,
        eventId,
        createdAt,
        userRole,
        userName,
        userEmail,
        userId,
        userImage,
        userOrganisation,
        userDesignation,
        reported,
        numOfTimesReported,
        visibilityStatus,
      },
      callback
    ) => {
      await NetworkingRoomChats.create(
        {
          isReply,
          textMessage,
          roomId,
          eventId,
          createdAt,
          userRole,
          userName,
          userEmail,
          userId,
          userImage,
          userOrganisation,
          userDesignation,
          reported,
          numOfTimesReported,
          visibilityStatus,
        },
        async (err, chatMsgDoc) => {
          if (err) {
            console.log(err);
          } else {
            if (isReply) {
              chatMsgDoc.replyTo = replyTo;
              await chatMsgDoc.save({ new: true, validateModifiedOnly: true });
            }

            const populatedChatMsg = await NetworkingRoomChats.findById(
              chatMsgDoc._id
            ).populate("replyTo");

            io.in(roomId).emit("newNetworkingMsg", {
              newMsg: populatedChatMsg,
            });
          }
        }
      );
    }
  );

  socket.on(
    "deleteNetworkingMessage",
    async ({ eventId, roomId, msgId }, callback) => {
      await NetworkingRoomChats.findByIdAndUpdate(
        msgId,
        { deleted: true },
        async (err, deletedMsg) => {
          if (err) {
            console.log(err);
          } else {
            await NetworkingRoomChats.find(
              {
                $and: [
                  { roomId: roomId },
                  { eventId: mongoose.Types.ObjectId(eventId) },
                ],
              },
              (err, doc) => {
                if (err) {
                  console.log(err);
                } else {
                  io.in(roomId).emit("networkingRoomMsgs", {
                    chats: doc,
                  });
                }
              }
            ).populate("replyTo");
          }
        }
      );
    }
  );

  socket.on(
    "startNetworking",
    async ({ eventId, userId, userName, image, socketId }, callback) => {
      // Make this person available for networking
      // Check if already available then just update his / her document otherwise create new document

      const existingUser = await AvailableForNetworking.findOne({
        $and: [
          { eventId: mongoose.Types.ObjectId(eventId) },
          { userId: mongoose.Types.ObjectId(userId) },
        ],
      });

      if (existingUser) {
        existingUser.socketId = socketId;
        await existingUser.save({ new: true, validateModifiedOnly: true });
      } else {
        const newUserForNetworking = await AvailableForNetworking.create({
          userId: userId,
          userName: userName,
          image: image,
          eventId: eventId,
          socketId: socketId,
          status: "Available",
        });
      }

      // Match with any random person from available users other than this user itself

      const availableForNetworking = await AvailableForNetworking.find({
        $and: [
          { eventId: mongoose.Types.ObjectId(eventId) },
          { userId: { $ne: mongoose.Types.ObjectId(userId) } },
        ],
      });

      if (availableForNetworking.length * 1 > 0) {
        let matchedPerson =
          availableForNetworking[
            Math.floor(Math.random() * availableForNetworking.length)
          ];

        const matchedPersonUserId = matchedPerson.userId;

        // Create a random room for both of them and send this room, person they are matched with

        let room = nanoid(16);

        // Find socket Id of both sender and receiver

        // Step 1. ) Find sender

        const SenderDoc = await UsersInEvent.findOne({
          $and: [
            { room: mongoose.Types.ObjectId(eventId) },
            { userId: mongoose.Types.ObjectId(userId) },
          ],
        });

        const senderSocket = SenderDoc.socketId; // ! Socket Id of sender

        // Step 2. ) Find reciever

        const RecieverDoc = await UsersInEvent.findOne({
          $and: [
            { room: mongoose.Types.ObjectId(eventId) },
            { userId: mongoose.Types.ObjectId(matchedPersonUserId) },
          ],
        });

        const recieverSocket = RecieverDoc.socketId; // ! Socket Id of reciver

        // Find user document of both sender and receiver

        const senderUserDoc = await User.findById(userId); // Sender user document
        const receiverUserDoc = await User.findById(matchedPersonUserId); // Receiver user document

        //  Create a NetworkingRoom with roomId

        const newNetworkingRoom = await NetworkingRoom.create({
          roomId: room,
          eventId: eventId,
          createdAt: Date.now(),
        });

        newNetworkingRoom.matchedUsers.push(userId);
        newNetworkingRoom.matchedUsers.push(matchedPersonUserId);

        await newNetworkingRoom.save({ new: true, validateModifiedOnly: true });

        // Send matched with and room id to both sender and reciever

        io.in(senderSocket).emit("newMatch", {
          room: room,
          matchedWith: receiverUserDoc,
        });

        io.in(recieverSocket).emit("newMatch", {
          room: room,
          matchedWith: senderUserDoc,
        });

        // Mark both sender and reciever as not available for networking

        await AvailableForNetworking.findOneAndDelete({
          $and: [
            { eventId: mongoose.Types.ObjectId(eventId) },
            { userId: mongoose.Types.ObjectId(userId) },
          ],
        }); // Delete sender

        await AvailableForNetworking.findOneAndDelete({
          $and: [
            { eventId: mongoose.Types.ObjectId(eventId) },
            { userId: mongoose.Types.ObjectId(matchedPersonUserId) },
          ],
        }); // Delete receiver
      }
    }
  );

  socket.on("subscribeBackstage", async ({ sessionId }, callback) => {
    socket.join(`${sessionId}-back`); // Call this while joining backstage
  });

  socket.on("unsubscribeBackstage", async ({ sessionId }, callback) => {
    socket.leave(`${sessionId}-back`); // Call this while leaving backstage
  });

  socket.on(
    "transmitBackstageMessage",
    async ({
      isReply,
      replyTo,
      textMessage,
      eventId,
      sessionId,
      createdAt,
      userRole,
      userName,
      userEmail,
      userId,
      userImage,
      userOrganisation,
      userDesignation,
      reported,
      numOfTimesReported,
      visibilityStatus,
      // isBackStageMessage => true
    }) => {
      // Here process incoming backstage message

      await SessionBackstageMessage.create(
        {
          isReply,
          textMessage,
          eventId,
          sessionId,
          createdAt,
          userRole,
          userName,
          userEmail,
          userImage,
          userOrganisation,
          userDesignation,
          userId,
          reported,
          numOfTimesReported,
          visibilityStatus,
        },
        async (err, chatMsgDoc) => {
          if (err) {
            console.log(err);
          } else {
            if (isReply) {
              chatMsgDoc.replyTo = replyTo;
              await chatMsgDoc.save({ new: true, validateModifiedOnly: true });
            }
            const populatedChatMsg = await SessionBackstageMessage.findById(
              chatMsgDoc._id
            ).populate("replyTo");

            io.in(`${sessionId}-back`).emit("newBackstageMsg", {
              newMsg: populatedChatMsg,
            });
          }
        }
      );
    }
  );

  socket.on("deleteBackstageMessage", async ({ msgId, eventId, sessionId }) => {
    // Here process deleting backstage message

    const deletedMsg = await SessionBackstageMessage.findByIdAndUpdate(
      msgId,
      { deleted: true },
      { new: true, validateModifiedOnly: true }
    );

    const populatedMsg = await SessionBackstageMessage.findById(msgId).populate(
      "replyTo"
    );

    io.in(`${sessionId}-back`).emit("deleteBackstageMsg", {
      deletedMsg: populatedMsg,
    });
  });

  socket.on(
    "transmitBoothMessage",
    async (
      {
        isReply,
        replyTo,
        textMessage,
        eventId,
        boothId,
        createdAt,
        userRole,
        userName,
        userEmail,
        userId,
        userImage,
        userOrganisation,
        userDesignation,
        reported,
        numOfTimesReported,
        visibilityStatus,
      },
      callback
    ) => {
      socket.join(boothId);
      await BoothChats.create(
        {
          isReply,
          replyTo,
          textMessage,
          eventId,
          boothId,
          createdAt,
          userRole,
          userName,
          userEmail,
          userId,
          userImage,
          userOrganisation,
          userDesignation,
          reported,
          numOfTimesReported,
          visibilityStatus,
        },
        async (err, chatMsgDoc) => {
          if (err) {
            console.log(err);
          } else {
            if (isReply) {
              chatMsgDoc.replyTo = replyTo;
              await chatMsgDoc.save({ new: true, validateModifiedOnly: true });
            }
            const populatedChatMsg = await BoothChats.find({
              boothId: mongoose.Types.ObjectId(boothId),
            }).populate("replyTo");

            console.log(populatedChatMsg);

            io.in(boothId).emit("newBoothMsg", {
              chats: populatedChatMsg,
            });
          }
        }
      );
    }
  );

  socket.on(
    "transmitBoothTableMessage",
    async (
      {
        isReply,
        replyTo,
        textMessage,
        eventId,
        tableId,
        createdAt,
        userRole,
        userName,
        userEmail,
        userId,
        userImage,
        userOrganisation,
        userDesignation,
        reported,
        numOfTimesReported,
        visibilityStatus,
      },
      callback
    ) => {
      await BoothTableChats.create(
        {
          isReply,
          textMessage,
          eventId,
          tableId,
          createdAt,
          userRole,
          userName,
          userEmail,
          userImage,
          userOrganisation,
          userDesignation,
          userId,
          reported,
          numOfTimesReported,
          visibilityStatus,
        },
        async (err, chatMsgDoc) => {
          if (err) {
            console.log(err);
          } else {
            if (isReply) {
              chatMsgDoc.replyTo = replyTo;
              await chatMsgDoc.save({ new: true, validateModifiedOnly: true });
            }
            const populatedChatMsg = await BoothTableChats.find({
              tableId: tableId,
            }).populate("replyTo");

            console.log(populatedChatMsg);

            io.in(tableId).emit("newBoothTableMsg", {
              chats: populatedChatMsg,
            });
          }
        }
      );
    }
  );

  socket.on("deleteBoothTableMessage", async ({ msgId, tableId }) => {
    await BoothTableChats.findByIdAndUpdate(msgId, { deleted: true });

    await BoothTableChats.find({ tableId: tableId }, async (err, doc) => {
      io.in(tableId).emit("updateBoothTableChats", {
        chats: doc,
      });
    }).populate("replyTo");
  });

  socket.on("deleteBoothMessage", async ({ msgId, boothId }) => {
    await BoothChats.findByIdAndUpdate(msgId, { deleted: true });

    await BoothChats.find(
      { boothId: mongoose.Types.ObjectId(boothId) },
      async (err, doc) => {
        io.in(boothId).emit("updateBoothChats", {
          chats: doc,
        });
      }
    ).populate("replyTo");
  });

  socket.on(
    "transmitSessionMessage",
    async ({
      isReply,
      replyTo,
      textMessage,
      eventId,
      sessionId,
      createdAt,
      userRole,
      userName,
      userEmail,
      userId,
      userImage,
      userOrganisation,
      userDesignation,
      reported,
      numOfTimesReported,
      visibilityStatus,
    }) => {
      await SessionChatMessage.create(
        {
          isReply,
          textMessage,
          eventId,
          sessionId,
          createdAt,
          userRole,
          userName,
          userEmail,
          userImage,
          userOrganisation,
          userDesignation,
          userId,
          reported,
          numOfTimesReported,
          visibilityStatus,
        },
        async (err, chatMsgDoc) => {
          if (err) {
            console.log(err);
          } else {
            if (isReply) {
              chatMsgDoc.replyTo = replyTo;
              await chatMsgDoc.save({ new: true, validateModifiedOnly: true });
            }
            const populatedChatMsg = await SessionChatMessage.findById(
              chatMsgDoc._id
            ).populate("replyTo");

            io.in(sessionId).emit("newSessionMsg", {
              newMsg: populatedChatMsg,
            });
          }
        }
      );
    }
  );

  socket.on("deleteSessionMessage", async ({ msgId, eventId, sessionId }) => {
    const deletedMsg = await SessionChatMessage.findByIdAndUpdate(
      msgId,
      { deleted: true },
      { new: true, validateModifiedOnly: true }
    );

    const populatedMsg = await SessionChatMessage.findById(msgId).populate(
      "replyTo"
    );

    io.in(sessionId).emit("deletedMsg", {
      deletedMsg: populatedMsg,
    });
  });

  socket.on(
    "showMsgOnStage",
    async ({ msgId, sessionId, eventId }, callback) => {
      // Set the requested msg as show on stage and all msgs back to everyone in this session

      await SessionChatMessage.findByIdAndUpdate(
        msgId,
        { showOnStage: true },
        { new: true, validateModifiedOnly: true }
      );

      let otherMsgs = await SessionChatMessage.find({
        $and: [
          { sessionId: sessionId },
          { eventId: eventId },
          { _id: { $ne: msgId } },
        ],
      });

      for (let element of otherMsgs) {
        element.showOnStage = false;
        await element.save({ new: true, validateModifiedOnly: true });
      }

      const msgs = await SessionChatMessage.find({
        $and: [{ sessionId: sessionId }, { eventId: eventId }],
      });

      // Send all msgs back to everyone in this session

      io.in(sessionId).emit("sessionMessages", {
        msgs: msgs,
      });
    }
  );

  socket.on(
    "markAsAvailableInSession",
    async ({
      role,
      state,
      userId,
      userEmail,
      registrationId,
      sessionId,
      eventId,
      microphone,
      camera,
      screen,
    }) => {
      // Find session and make this user available in people onLiveStage array or onBackStage People based on his channel
      // Then send updated session to all users in this session

      const sessionDoc = await Session.findById(sessionId)
        .populate("host")
        .populate("speaker")
        .populate("people");

      sessionDoc.onStagePeople.push({
        user: userId,
        userRole: role,
        camera: false,
        microphone: false,
        screen: false,
      });

      await sessionDoc.save({ new: true, validateModifiedOnly: true });

      // Send updated user to everyone in this session

      const updatedSession = await Session.findById(sessionId)
        .populate("host")
        .populate("speaker")
        .populate("people");

      const { socketId } = await UsersInEvent.findOne({
        $and: [
          { room: mongoose.Types.ObjectId(eventId) },
          { userId: mongoose.Types.ObjectId(userId) },
        ],
      }).select("socketId");

      io.to(socketId).emit("updatedSession", {
        updatedSession: updatedSession,
      });

      io.in(sessionId).emit("updatedSession", {
        updatedSession: updatedSession,
      });
    }
  );

  socket.on(
    "updateMyMicOnSessionStage",
    async ({ userId, registrationId, sessionId, microphone }, callback) => {
      // Update user mic

      // 1.) Find session doc

      const sessionDoc = await Session.findById(sessionId);

      // 2.) Find and update user on stage

      const thisUserOnStage = await sessionDoc.onStagePeople.find(
        (person) => person.user.toString() === userId.toString()
      );

      if (thisUserOnStage) {
        thisUserOnStage.microphone = microphone;
      }

      // 3.) save session doc

      await sessionDoc.save({ new: true, validateModifiedOnly: true });
      const updatedSession = await Session.findById(sessionId)
        .populate("host")
        .populate("speaker")
        .populate("people");

      // 4.) Send updated session doc to everyone in this session.

      io.in(sessionId).emit("updatedSession", {
        updatedSession: updatedSession,
      });
    }
  );

  socket.on(
    "updateMyMicOnNetworkingRoom",
    async ({ userId, eventId, roomId, microphone }, callback) => {
      // Update user mic

      // 1.) Find NetworkingRoom doc

      const networkingRoomDoc = await NetworkingRoom.findOne({
        roomId: roomId,
      });

      // 2.) Find and update user on stage

      let thisUserOnStage;

      for (let element of networkingRoomDoc.onStagePeople) {
        console.log(element.user, userId);
        if (element.user == userId) {
          thisUserOnStage = element;
        }
      }

      thisUserOnStage.microphone = microphone;

      // 3.) save Table Doc

      await networkingRoomDoc.save({ new: true, validateModifiedOnly: true });
      const updatedNetworkingRoomDoc = await NetworkingRoom.findOne({
        roomId: roomId,
      });

      // 4.) Send updated networking room doc to everyone in this networking room.

      io.in(roomId).emit("updatedNetworkingRoom", {
        updatedNetworkingRoom: updatedNetworkingRoomDoc,
      });
    }
  );

  socket.on(
    "updateMyMicOnLoungeTable",
    async ({ userId, tableId, eventId, microphone, rawTableId }, callback) => {
      // Update user mic

      // 1.) Find RoomTable doc

      const loungeTableDoc = await RoomTable.findById(tableId);

      // 2.) Find and update user on stage

      let thisUserOnStage;

      for (let element of loungeTableDoc.onStagePeople) {
        console.log(element.user, userId);
        if (element.user == userId) {
          thisUserOnStage = element;
        }
      }

      thisUserOnStage.microphone = microphone;

      // 3.) save Table Doc

      await loungeTableDoc.save({ new: true, validateModifiedOnly: true });
      const updatedLoungeTable = await RoomTable.findById(tableId);

      // 4.) Send updated booth table to everyone at this table.

      io.in(rawTableId).emit("updatedLoungeTable", {
        tableDetails: updatedLoungeTable,
      });
    }
  );

  socket.on(
    "updateMyMicOnBoothTable",
    async (
      { userId, tableId, boothId, eventId, microphone, rawTableId },
      callback
    ) => {
      // Update user mic

      // 1.) Find boothTable doc
      const boothTableDoc = await BoothTable.findById(tableId);

      // 2.) Find and update user on stage

      let thisUserOnStage;

      for (let element of boothTableDoc.onStagePeople) {
        console.log(element.user, userId);
        if (element.user == userId) {
          thisUserOnStage = element;
        }
      }

      thisUserOnStage.microphone = microphone;

      // 3.) save Table Doc

      await boothTableDoc.save({ new: true, validateModifiedOnly: true });
      const updatedBoothTable = await BoothTable.findById(tableId);

      // 4.) Send updated booth table to everyone at this table.

      io.in(rawTableId).emit("updatedBoothTable", {
        tableDetails: updatedBoothTable,
      });
    }
  );

  socket.on(
    "updateMyCameraOnNetworkingRoom",
    async ({ userId, eventId, roomId, camera }, callback) => {
      // Update user camera

      // 1.) Find NetworkingRoom doc

      const networkingRoomDoc = await NetworkingRoom.findOne({
        roomId: roomId,
      });

      // 2.) Find and update user on stage

      let thisUserOnStage;

      for (let element of networkingRoomDoc.onStagePeople) {
        console.log(element.user, userId);
        if (element.user == userId) {
          thisUserOnStage = element;
        }
      }

      thisUserOnStage.camera = camera;

      // 3.) save Table Doc

      await networkingRoomDoc.save({ new: true, validateModifiedOnly: true });
      const updatedNetworkingRoomDoc = await NetworkingRoom.findOne({
        roomId: roomId,
      });

      // 4.) Send updated networking room doc to everyone in this networking room.

      io.in(roomId).emit("updatedNetworkingRoom", {
        updatedNetworkingRoom: updatedNetworkingRoomDoc,
      });
    }
  );

  socket.on(
    "updateMyCameraOnLoungeTable",
    async ({ userId, tableId, eventId, camera, rawTableId }, callback) => {
      console.log("enetered update my camer");
      // Update user camera
      // 1.) Find loungeTable doc
      const loungeTableDoc = await RoomTable.findById(tableId);

      // 2.) Find and update user on stage

      let thisUserOnStage;

      for (let element of loungeTableDoc.onStagePeople) {
        console.log(element.user, userId);
        if (element.user == userId) {
          thisUserOnStage = element;
        }
      }

      thisUserOnStage.camera = camera;

      // 3.) save Table Doc

      await loungeTableDoc.save({ new: true, validateModifiedOnly: true });
      const updatedLoungeTable = await RoomTable.findById(tableId);

      console.log(updatedLoungeTable);

      // 4.) Send updated lounge table to everyone at this table.

      io.to(rawTableId).emit("updatedLoungeTable", {
        tableDetails: updatedLoungeTable,
      });
    }
  );

  socket.on(
    "updateMyCameraOnBoothTable",
    async (
      { userId, tableId, boothId, eventId, camera, rawTableId },
      callback
    ) => {
      // Update user camera
      // 1.) Find boothTable doc
      const boothTableDoc = await BoothTable.findById(tableId);

      // 2.) Find and update user on stage

      let thisUserOnStage;

      for (let element of boothTableDoc.onStagePeople) {
        console.log(element.user, userId);
        if (element.user == userId) {
          thisUserOnStage = element;
        }
      }

      thisUserOnStage.camera = camera;

      // 3.) save Table Doc

      await boothTableDoc.save({ new: true, validateModifiedOnly: true });
      const updatedBoothTable = await BoothTable.findById(tableId);

      console.log(updatedBoothTable);

      // 4.) Send updated booth table to everyone at this table.

      io.in(rawTableId).emit("updatedBoothTable", {
        tableDetails: updatedBoothTable,
      });
    }
  );

  socket.on(
    "updateMyScreenOnNetworkingRoom",
    async ({ userId, eventId, roomId, screen }, callback) => {
      // Update user screen
      // 1.) Find networkingRoom doc

      const networkingRoomDoc = await NetworkingRoom.findOne({
        roomId: roomId,
      });

      const registrations = await Registration.find({
        bookedForEventId: mongoose.Types.ObjectId(eventId),
      });

      // 2.) Find and update user on stage

      let thisUserOnStage;

      for (let element of networkingRoomDoc.onStagePeople) {
        console.log(element.user, userId);
        if (element.user == userId) {
          thisUserOnStage = element;
        }
      }

      thisUserOnStage.screen = screen;

      // 3.) save Table Doc

      await networkingRoomDoc.save({ new: true, validateModifiedOnly: true });
      const updatedNetworkingRoomDoc = await NetworkingRoom.findOne({
        roomId: roomId,
      });

      // 4.) Send updated networking room doc to everyone in this networking room.

      io.in(roomId).emit("updatedNetworkingRoom", {
        updatedNetworkingRoom: updatedNetworkingRoomDoc,
      });

      let people = []; // Collection of {userId, socketId, camera, mic, screen}
      let uniquePeople = [];

      for (let element of networkingRoomDoc.onStagePeople) {
        for (let item of registrations) {
          console.log(element.user, item);
          if (item.bookedByUser) {
            if (element.user.toString() === item.bookedByUser.toString()) {
              if (!uniquePeople.includes(element.user)) {
                // Find socketId
                const { socketId } = await UsersInEvent.findOne({
                  $and: [
                    { room: mongoose.Types.ObjectId(eventId) },
                    { userId: mongoose.Types.ObjectId(item.bookedByUser) },
                  ],
                }).select("socketId");

                people.push({
                  userId: item.bookedByUser,
                  socketId: socketId,
                  camera: element.camera,
                  mic: element.microphone,
                  screen: element.screen,
                });

                uniquePeople.push(element.user);
              }
            }
          }
        }
      }

      // 5.) Find everyone who is currently on stage with thier current camera, mic, screen, socket and userId (collection of objects)
      // * Now here we have required persons in people array

      // 6.) Tell everyone currently on stage to set => userHasUnmutedVideo.current = false; and userHasUnmutedAudio.current = false;

      console.log(people);

      let filteredPeople = [];

      let uniqueSocketIds = [];

      for (let item of people) {
        if (!uniqueSocketIds.includes(item.socketId)) {
          filteredPeople.push(item);
          uniqueSocketIds.push(item.socketId);
        }
      }

      for (let element of filteredPeople) {
        io.to(element.socketId).emit("resetAudioAndVideoControls");
      }

      // 7.) Everyone with their camera currently on should call unMuteMyVideo();
      for (let person of filteredPeople) {
        if (person.camera) {
          io.to(person.socketId).emit("unMuteYourVideo");
        }
      }
    }
  );

  socket.on(
    "updateMyScreenOnLoungeTable",
    async ({ userId, tableId, eventId, screen, rawTableId }, callback) => {
      // Update user screen
      // 1.) Find boothTable doc
      const loungeTableDoc = await RoomTable.findById(tableId);

      const registrations = await Registration.find({
        bookedForEventId: mongoose.Types.ObjectId(eventId),
      });

      // 2.) Find and update user on stage

      let thisUserOnStage;

      for (let element of loungeTableDoc.onStagePeople) {
        console.log(element.user, userId);
        if (element.user == userId) {
          thisUserOnStage = element;
        }
      }

      thisUserOnStage.screen = screen;

      // 3.) save Table Doc

      await loungeTableDoc.save({ new: true, validateModifiedOnly: true });
      const updatedLoungeTable = await RoomTable.findById(tableId);

      console.log(updatedLoungeTable);

      // 4.) Send updated lounge table to everyone at this table.

      io.in(rawTableId).emit("updatedLoungeTable", {
        tableDetails: updatedLoungeTable,
      });

      let people = []; // Collection of {userId, socketId, camera, mic, screen}
      let uniquePeople = [];

      for (let element of loungeTableDoc.onStagePeople) {
        for (let item of registrations) {
          console.log(element.user, item);
          if (item.bookedByUser) {
            if (element.user.toString() === item.bookedByUser.toString()) {
              if (!uniquePeople.includes(element.user)) {
                // Find socketId

                const { socketId } = await UsersInEvent.findOne({
                  $and: [
                    { room: mongoose.Types.ObjectId(eventId) },
                    { userId: mongoose.Types.ObjectId(item.bookedByUser) },
                  ],
                }).select("socketId");

                people.push({
                  userId: item.bookedByUser,
                  socketId: socketId,
                  camera: element.camera,
                  mic: element.microphone,
                  screen: element.screen,
                });

                uniquePeople.push(element.user);
              }
            }
          }
        }
      }

      // 5.) Find everyone who is currently on stage with thier current camera, mic, screen, socket and userId (collection of objects)
      // * Now here we have required persons in people array

      // 6.) Tell everyone currently on stage to set => userHasUnmutedVideo.current = false; and userHasUnmutedAudio.current = false;

      console.log(people);

      for (let element of people) {
        io.to(element.socketId).emit("resetAudioAndVideoControls");
      }

      // 7.) Everyone with their camera currently on should call unMuteMyVideo();
      for (let person of people) {
        if (person.camera) {
          io.to(person.socketId).emit("unMuteYourVideo");
        }
      }
    }
  );

  socket.on(
    "updateMyScreenOnBoothTable",
    async (
      { userId, tableId, boothId, eventId, screen, rawTableId },
      callback
    ) => {
      // Update user screen
      // 1.) Find boothTable doc
      const boothTableDoc = await BoothTable.findById(tableId);

      const registrations = await Registration.find({
        bookedForEventId: mongoose.Types.ObjectId(eventId),
      });

      // 2.) Find and update user on stage

      let thisUserOnStage;

      for (let element of boothTableDoc.onStagePeople) {
        console.log(element.user, userId);
        if (element.user == userId) {
          thisUserOnStage = element;
        }
      }

      thisUserOnStage.screen = screen;

      // 3.) save Table Doc

      await boothTableDoc.save({ new: true, validateModifiedOnly: true });
      const updatedBoothTable = await BoothTable.findById(tableId);

      console.log(updatedBoothTable);

      // 4.) Send updated booth table to everyone at this table.

      io.in(rawTableId).emit("updatedBoothTable", {
        tableDetails: updatedBoothTable,
      });

      let people = []; // Collection of {userId, socketId, camera, mic, screen}
      let uniquePeople = [];

      for (let element of boothTableDoc.onStagePeople) {
        for (let item of registrations) {
          console.log(element.user, item);
          if (item.bookedByUser) {
            if (element.user.toString() === item.bookedByUser.toString()) {
              if (!uniquePeople.includes(element.user)) {
                // Find socketId

                const { socketId } = await UsersInEvent.findOne({
                  $and: [
                    { room: mongoose.Types.ObjectId(eventId) },
                    { userId: mongoose.Types.ObjectId(item.bookedByUser) },
                  ],
                }).select("socketId");

                people.push({
                  userId: item.bookedByUser,
                  socketId: socketId,
                  camera: element.camera,
                  mic: element.microphone,
                  screen: element.screen,
                });

                uniquePeople.push(element.user);
              }
            }
          }
        }
      }

      // 5.) Find everyone who is currently on stage with thier current camera, mic, screen, socket and userId (collection of objects)
      // * Now here we have required persons in people array

      // 6.) Tell everyone currently on stage to set => userHasUnmutedVideo.current = false; and userHasUnmutedAudio.current = false;

      console.log(people);

      let filteredPeople = [];

      let uniqueSocketIds = [];

      for (let item of people) {
        if (!uniqueSocketIds.includes(item.socketId)) {
          filteredPeople.push(item);
          uniqueSocketIds.push(item.socketId);
        }
      }

      for (let element of filteredPeople) {
        io.to(element.socketId).emit("resetAudioAndVideoControls");
      }

      // 7.) Everyone with their camera currently on should call unMuteMyVideo();
      for (let person of filteredPeople) {
        if (person.camera) {
          io.to(person.socketId).emit("unMuteYourVideo");
        }
      }
    }
  );

  socket.on(
    "updateMyCameraOnSessionStage",
    async (
      { channel, state, userId, registrationId, sessionId, camera },
      callback
    ) => {
      // Update user mic
      // 1.) Find session doc

      const sessionDoc = await Session.findById(sessionId);

      // 2.) Find and update user on stage

      const thisUserOnStage = await sessionDoc.onStagePeople.find(
        (person) => person.user.toString() === userId.toString()
      );

      if (thisUserOnStage) {
        thisUserOnStage.camera = camera;
      }

      // 3.) save session doc

      await sessionDoc.save({ new: true, validateModifiedOnly: true });
      const updatedSession = await Session.findById(sessionId)
        .populate("host")
        .populate("speaker")
        .populate("people");

      // 4.) Send updated session doc to everyone in this session.

      io.in(sessionId).emit("updatedSession", {
        updatedSession: updatedSession,
      });
    }
  );

  socket.on(
    "updateMyScreenOnSessionStage",
    async (
      { channel, state, userId, registrationId, sessionId, eventId, screen },
      callback
    ) => {
      // Update user screen share
      // 1.) Find session doc

      const sessionDoc = await Session.findById(sessionId);

      const registrations = await Registration.find({
        bookedForEventId: mongoose.Types.ObjectId(eventId),
      });

      // 2.) Find and update user on stage

      const thisUserOnStage = await sessionDoc.onStagePeople.find(
        (person) => person.user.toString() === userId.toString()
      );

      if (thisUserOnStage) {
        thisUserOnStage.screen = screen;
      }

      // 3.) save session doc

      await sessionDoc.save({ new: true, validateModifiedOnly: true });
      const updatedSession = await Session.findById(sessionId)
        .populate("host")
        .populate("speaker")
        .populate("people");

      // 4.) Send updated session doc to everyone in this session.

      io.in(sessionId).emit("updatedSession", {
        updatedSession: updatedSession,
      });

      let people = []; // Collection of {userId, socketId, camera, mic, screen}
      // console.log(sessionDoc.onStagePeople);
      // console.log(registrations);

      let allPeopleOnStage = updatedSession.onStagePeople;

      for (let element of allPeopleOnStage) {
        for (let item of registrations) {
          if (item.bookedByUser && element.user) {
            if (element.user.toString() === item.bookedByUser.toString()) {
              const { socketId } = await UsersInSession.findOne({
                $and: [
                  { room: mongoose.Types.ObjectId(sessionId) },
                  { userId: mongoose.Types.ObjectId(item.bookedByUser) },
                ],
              }).select("socketId");

              people.push({
                userId: item.bookedByUser,
                socketId: socketId,
                camera: element.camera,
                mic: element.microphone,
                screen: element.screen,
              });
            }
          }
        }
      }

      // 5.) Find everyone who is currently on stage with thier current camera, mic, screen, socket and userId (collection of objects)
      // * Now here we have required persons in people array

      // 6.) Tell everyone currently on stage to set => userHasUnmutedVideo.current = false; and userHasUnmutedAudio.current = false;

      console.log(people);
      let filteredPeople = [];

      let uniqueSocketIds = [];

      for (let item of people) {
        if (!uniqueSocketIds.includes(item.socketId)) {
          filteredPeople.push(item);
          uniqueSocketIds.push(item.socketId);
        }
      }

      for (let element of filteredPeople) {
        io.to(element.socketId).emit("resetAudioAndVideoControls");
      }

      // 7.) Everyone with their camera currently on should call unMuteMyVideo();
      for (let person of filteredPeople) {
        if (person.camera) {
          io.to(person.socketId).emit("unMuteYourVideo");
        }
      }
    }
  );

  socket.on(
    "removeFromOnSessionStage",
    async ({ userId, sessionId, eventId }, callback) => {
      const sessionDoc = await Session.findById(sessionId);

      sessionDoc.onStagePeople = sessionDoc.onStagePeople.filter(
        (person) => person.user.toString() !== userId.toString()
      );

      sessionDoc.raisedHands = sessionDoc.raisedHands.filter(
        (person) => person.userId.toString() !== userId.toString()
      );

      await sessionDoc.save({ new: true, validateModifiedOnly: true });

      // Send updated user to everyone in this session

      const updatedSession = await Session.findById(sessionId)
        .populate("host")
        .populate("speaker")
        .populate("people");

      io.in(sessionId).emit("updatedSession", {
        updatedSession: updatedSession,
      });
    }
  );

  socket.on(
    "removeMeFromSessionStage",
    async (
      {
        leaveSession,
        userId,
        userEmail,
        registrationId,
        sessionId,
        eventId,
        microphone,
        camera,
        screen,
        available,
      },
      callback
    ) => {
      // Remove from both onLiveStagePeople and onBackStagePeople
      // send updated session doc to everyone in event

      const sessionDoc = await Session.findById(sessionId);

      sessionDoc.onStagePeople = sessionDoc.onStagePeople.filter(
        (person) => person.user.toString() !== userId.toString()
      );

      sessionDoc.raisedHands = sessionDoc.raisedHands.filter(
        (person) => person.userId.toString() !== userId.toString()
      );

      await sessionDoc.save({ new: true, validateModifiedOnly: true });

      // Send updated user to everyone in this session

      const updatedSession = await Session.findById(sessionId)
        .populate("host")
        .populate("speaker")
        .populate("people");

      io.in(sessionId).emit("updatedSession", {
        updatedSession: updatedSession,
      });

      // Send fully updated session dooc to everyone in this session
    }
  );

  socket.on(
    "transmitSessionQnA",
    async ({ question, createdAt, askedBy, eventId, sessionId }, callback) => {
      // Create a new qnA doc in sessionQnA Model and send it to everyone in this session

      const newQnA = await SessionQnA.create({
        question,
        createdAt,
        askedBy,
        eventId,
        sessionId,
      });

      const populatedQnA = await SessionQnA.findById(newQnA._id)
        .populate("askedBy")
        .populate("answeredBy");

      // Send this back to everyone in this session

      io.in(sessionId).emit("newQnA", {
        newQnA: populatedQnA,
      });
    }
  );

  socket.on("deleteSessionQnA", async ({ qnaId, sessionId }, callback) => {
    // Mark the requested QnA as deleted and send it back to everyone in this session

    const deletedQnA = await SessionQnA.findByIdAndUpdate(
      qnaId,
      { deleted: true },
      { new: true, validateModifiedOnly: true }
    )
      .populate("askedBy")
      .populate("answeredBy");

    // Send this back to everyone in this session

    io.in(sessionId).emit("deletedQnA", {
      deletedQnA: deletedQnA,
    });
  });

  socket.on("upvoteQnA", async ({ qnaId, userId, sessionId }, callback) => {
    const qna = await SessionQnA.findById(qnaId);

    qna.upvotes = qna.upvotes + 1;
    qna.upvotedBy.push(userId);

    await qna.save({ new: true, validateModifiedOnly: true });

    const upvotedQnA = await SessionQnA.findById(qnaId)
      .populate("askedBy")
      .populate("answeredBy");

    // Send this back to everyone in this session

    io.in(sessionId).emit("upvotedQnA", {
      upvotedQnA: upvotedQnA,
    });
  });

  socket.on("downvoteQnA", async ({ qnaId, userId, sessionId }, callback) => {
    const qna = await SessionQnA.findById(qnaId);

    qna.upvotes = qna.upvotes - 1;
    qna.upvotedBy = qna.upvotedBy.filter((element) => element !== userId);

    await qna.save({ new: true, validateModifiedOnly: true });

    const downvotedQnA = await SessionQnA.findById(qnaId)
      .populate("askedBy")
      .populate("answeredBy");

    // Send this back to everyone in this session

    io.in(sessionId).emit("downvotedQnA", {
      downvotedQnA: downvotedQnA,
    });
  });

  socket.on(
    "answerQnA",
    async ({ answer, qnaId, answeredAt, sessionId, answeredBy }, callback) => {
      const qna = await SessionQnA.findById(qnaId);

      qna.answer = answer;
      qna.answeredBy = answeredBy;
      qna.answeredAt = answeredAt;

      await qna.save({
        new: true,
        validateModifiedOnly: true,
      });

      const answeredQnA = await SessionQnA.findById(qnaId)
        .populate("askedBy")
        .populate("answeredBy");

      io.in(sessionId).emit("answeredQnA", {
        answeredQnA: answeredQnA,
      });
    }
  );

  socket.on(
    "showQnAOnStage",
    async ({ qnaId, sessionId, eventId }, callback) => {
      // Mark the requested QnA as shownOnStage => true and all other QnA of this session as showOnStage as false and send all Qna back to everyone in this session

      await SessionQnA.findByIdAndUpdate(
        qnaId,
        { showOnStage: true },
        { new: true, validateModifiedOnly: true }
      );

      // Find all other QnAs of this session and mark them as showOnStage => false

      let otherQnAs = [];

      await SessionQnA.find(
        {
          $and: [{ sessionId: sessionId }, { eventId: eventId }],
        },
        (err, doc) => {
          otherQnAs = doc.filter(
            (element) => element._id.toString() !== qnaId.toString()
          );
        }
      );

      // console.log(otherQnAs);

      for (let element of otherQnAs) {
        element.showOnStage = false;
        const updated = await element.save({
          new: true,
          validateModifiedOnly: true,
        });
        //  console.log(updated);
      }

      const sessionQnAs = await SessionQnA.find({
        $and: [{ sessionId: sessionId }, { eventId: eventId }],
      })
        .populate("askedBy")
        .populate("answeredBy");

      // Send back all QnAs of this session to everyone in this session

      io.in(sessionId).emit("sessionQnAs", {
        sessionQnAs: sessionQnAs,
      });
    }
  );

  socket.on(
    "hideQnAFromStage",
    async ({ qnaId, sessionId, eventId }, callback) => {
      // Mark the requested QnA as showOnStage => false and send back all QnAs of this session to everyone in this session

      await SessionQnA.findByIdAndUpdate(
        qnaId,
        { showOnStage: false },
        { new: true, validateModifiedOnly: true }
      );

      const sessionQnAs = await SessionQnA.find({
        $and: [
          { sessionId: mongoose.Types.ObjectId(sessionId) },
          { eventId: mongoose.Types.ObjectId(eventId) },
        ],
      })
        .populate("askedBy")
        .populate("answeredBy");

      // Send back all QnAs of this session to everyone in this session

      io.in(sessionId).emit("hideQnAFromStage", {
        sessionQnAs: sessionQnAs,
      });
    }
  );

  socket.on(
    "createSessionPoll",
    async (
      {
        question,
        eventId,
        sessionId,
        createdBy,
        options,
        expiresAt,

        whoCanSeeAnswers,
        createdAt,
      },
      callback
    ) => {
      // Create requested poll and send it back to everyone in this session

      const newPoll = await SessionPoll.create({
        question,
        eventId,
        sessionId,
        createdBy,

        whoCanSeeAnswers,
        createdAt,
      });

      if (expiresAt) {
        newPoll.expiresAt = expiresAt;
      }

      for (let element of options) {
        newPoll.options.push(element);
      }

      await newPoll.save({
        new: true,
        validateModifiedOnly: true,
      });

      const populatedPoll = await SessionPoll.findById(newPoll._id).populate(
        "createdBy"
      );
      // Send this poll to everyone in this session

      io.in(sessionId).emit("newPoll", {
        createdPoll: populatedPoll,
      });
    }
  );

  socket.on(
    "deleteSessionPoll",
    async ({ pollId, sessionId, eventId }, callback) => {
      // mark the requested session poll as deleted and send it back to everyone in this session

      const deletedPoll = await SessionPoll.findByIdAndUpdate(
        pollId,
        { deleted: true },
        { new: true, validateModifiedOnly: true }
      );

      io.in(sessionId).emit("deletedPoll", {
        deletedPoll: deletedPoll,
      });
    }
  );

  socket.on(
    "showSessionPollOnStage",
    async ({ pollId, sessionId, eventId }, callback) => {
      console.log(pollId, sessionId, eventId);
      // Mark the requested session poll as showOnStage => true and all other polls of this session as showOnStage => false and send back all polls of this session to everyone in this session

      await SessionPoll.findByIdAndUpdate(
        pollId,
        { showOnStage: true },
        { new: true, validateModifiedOnly: true }
      );

      // Mark all other session polls to showOnStage as false

      let otherPolls = [];

      await SessionPoll.find(
        {
          $and: [
            { sessionId: mongoose.Types.ObjectId(sessionId) },
            { eventId: mongoose.Types.ObjectId(eventId) },
          ],
        },
        (err, doc) => {
          for (let element of doc) {
            if (element._id.toString() !== pollId.toString()) {
              otherPolls.push(element);
            }
          }
        }
      );

      for (let element of otherPolls) {
        element.showOnStage = false;
        const result = await element.save({
          new: true,
          validateModifiedOnly: true,
        });
        // console.log(result);
      }

      // Now get all polls of this session and send it to everyone in this session

      const polls = await SessionPoll.find({
        $and: [
          { sessionId: mongoose.Types.ObjectId(sessionId) },
          { eventId: mongoose.Types.ObjectId(eventId) },
        ],
      }).populate("createdBy");

      io.in(sessionId).emit("sessionPolls", {
        polls: polls,
      });
    }
  );

  socket.on(
    "hideSessionPollFromStage",
    async ({ pollId, sessionId, eventId }, callback) => {
      // Mark the requested session poll as showOnStage => false and send back all polls of this session back to everyone in this session

      const updatedPoll = await SessionPoll.findByIdAndUpdate(
        pollId,
        { showOnStage: false },
        { new: true, validateModifiedOnly: true }
      );

      const polls = await SessionPoll.find({
        $and: [
          { sessionId: mongoose.Types.ObjectId(sessionId) },
          { eventId: mongoose.Types.ObjectId(eventId) },
        ],
      }).populate("createdBy");

      io.in(sessionId).emit("hidePollFromStage", {
        polls: polls,
      });
    }
  );

  socket.on(
    "submitSessionPollAns",
    async ({ pollId, optionId, voter, sessionId }, callback) => {
      // Update the requested poll with answer and send it back to everyone in this session

      // Get Poll by poll Id

      const pollToUpdate = await SessionPoll.findById(pollId);

      // Loop over all options and update the required options

      for (let element of pollToUpdate.options) {
        if (element._id.toString() === optionId.toString()) {
          element.numberOfVotes = element.numberOfVotes + 1;
          element.votedBy.push(voter);
        }
        // * Remember voter is the userId of person who is voting for this option
      }

      pollToUpdate.votedBy.push(voter);

      // save the whole poll doc

      const updatedPoll = await pollToUpdate.save({
        new: true,
        validateModifiedOnly: true,
      });

      const populatedPoll = await SessionPoll.findById(pollId).populate(
        "createdBy"
      );

      // Send back this updated poll to everyone in this session

      io.in(sessionId).emit("updatedPoll", {
        updatedPoll: populatedPoll,
      });
    }
  );

  socket.on(
    "playUploadedVideoOnStage",
    async ({ sessionId, eventId, videoURL }, callback) => {
      // Find session doc and update videoLink

      const sessionDoc = await Session.findById(sessionId);

      sessionDoc.videoLink = videoURL;

      const updatedSession = await sessionDoc.save({
        new: true,
        validateModifiedOnly: true,
      });

      io.in(sessionId).emit("updatedSession", {
        updatedSession: updatedSession,
      });

      // send this updated session doc to everyone in this session

      io.in(sessionId).emit("playUploadedVideoOnStage", {
        videoURL: videoURL,
      });
    }
  );

  socket.on(
    "stopUploadedVideoOnStage",
    async ({ sessionId, eventId }, callback) => {
      // Remove video in playUploadedVideoOnStage in this session and send it back to everyone in this session

      // Find session doc and update videoLink

      const sessionDoc = await Session.findById(sessionId);

      sessionDoc.videoLink = null;

      const updatedSession = await sessionDoc.save({
        new: true,
        validateModifiedOnly: true,
      });

      io.in(sessionId).emit("updatedSession", {
        updatedSession: updatedSession,
      });

      // send this updated session doc to everyone in this session

      io.in(sessionId).emit("stopUploadedVideoOnStage");
    }
  );

  socket.on("muteMic", async ({ userId, sessionId }, callback) => {
    // Send mute mic command to requested person

    // Find speaker in this session socket id and emit event "muteMic"

    const UserDoc = await UsersInSession.findOne({
      $and: [
        { room: mongoose.Types.ObjectId(sessionId) },
        { userId: mongoose.Types.ObjectId(userId) },
      ],
    });

    const userSocket = UserDoc.socketId; // ! Socket Id of user whose mic needs to be muted

    io.to(userSocket).emit("muteMic");
  });

  socket.on("muteVideo", async ({ userId, sessionId }, callback) => {
    // Send mute video command to requested person socket

    // Find speaker in this session socket id and emit event "muteCamera"

    const UserDoc = await UsersInSession.findOne({
      $and: [
        { room: mongoose.Types.ObjectId(sessionId) },
        { userId: mongoose.Types.ObjectId(userId) },
      ],
    });

    const userSocket = UserDoc.socketId; // ! Socket Id of user whose camer needs to be turned off

    io.to(userSocket).emit("muteCamera");
  });

  socket.on("muteScreenShare", async ({ userId, sessionId }, callback) => {
    // Send mute screen share command to requested persons socket

    // Find speaker in this session socket id and emit event "stopScreenShare"

    const UserDoc = await UsersInSession.findOne({
      $and: [
        { room: mongoose.Types.ObjectId(sessionId) },
        { userId: mongoose.Types.ObjectId(userId) },
      ],
    });

    const userSocket = UserDoc.socketId; // ! Socket Id of attendee

    io.to(userSocket).emit("stopScreenShare");
  });

  socket.on(
    "insertLink",
    async (
      { sessionId, eventId, link, title, description, createdBy },
      callback
    ) => {
      // Add this link to sessions shared link and send it back to everyone in this session

      const newInsertedLink = await SessionInsertedLink.create({
        sessionId,
        eventId,
        link,
        title,
        description,
        createdBy,
        createdAt: Date.now(),
      });

      io.in(sessionId).emit("newInsertedLink", {
        newInsertedLink: newInsertedLink,
      });
    }
  );

  socket.on(
    "sponsorShoutout",
    async (
      { sesionId, eventId, sponsorId, description, link, createdBy },
      callback
    ) => {
      // Add this sponsor to list of shoutouts and send it back to everyone in this session

      const newSponsorShoutout = await SessionSponsorShoutout.create({
        sesionId,
        eventId,
        sponsorId,
        description,
        link,
        createdBy,
        createdAt: Date.now(),
      });

      io.in(sessionId).emit("newSponsorShoutout", {
        newSponsorShoutout: newSponsorShoutout,
      });
    }
  );

  socket.on("playVideo", async ({ sessionId, url }, callback) => {
    // Update session video property and send to everyone in this session

    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      { video: url },
      { new: true, validateModifiedOnly: true }
    )
      .populate("host")
      .populate("speaker")
      .populate("people");

    io.in(sessionId).emit("startVideo", {
      updatedSession: updatedSession,
    });

    const eventId = updatedSession.eventId;

    const registrations = await Registration.find({
      bookedForEventId: mongoose.Types.ObjectId(eventId),
    });

    let people = []; // Collection of {userId, socketId, camera, mic, screen}
    let uniquePeople = [];

    for (let element of updatedSession.onStagePeople) {
      for (let item of registrations) {
        console.log(element.user, item);
        if (item.bookedByUser) {
          if (element.user.toString() === item.bookedByUser.toString()) {
            if (!uniquePeople.includes(element.user)) {
              // Find socketId
              const { socketId } = await UsersInEvent.findOne({
                $and: [
                  { room: mongoose.Types.ObjectId(eventId) },
                  { userId: mongoose.Types.ObjectId(item.bookedByUser) },
                ],
              }).select("socketId");

              people.push({
                userId: item.bookedByUser,
                socketId: socketId,
                camera: element.camera,
                mic: element.microphone,
                screen: element.screen,
              });

              uniquePeople.push(element.user);
            }
          }
        }
      }
    }

    // 5.) Find everyone who is currently on stage with thier current camera, mic, screen, socket and userId (collection of objects)
    // * Now here we have required persons in people array

    // 6.) Tell everyone currently on stage to set => userHasUnmutedVideo.current = false; and userHasUnmutedAudio.current = false;

    console.log(people);

    let filteredPeople = [];

    let uniqueSocketIds = [];

    for (let item of people) {
      if (!uniqueSocketIds.includes(item.socketId)) {
        filteredPeople.push(item);
        uniqueSocketIds.push(item.socketId);
      }
    }

    for (let element of filteredPeople) {
      io.to(element.socketId).emit("resetAudioAndVideoControls");
    }

    // 7.) Everyone with their camera currently on should call unMuteMyVideo();
    for (let person of filteredPeople) {
      if (person.camera) {
        io.to(person.socketId).emit("unMuteYourVideo");
      }
    }
  });

  socket.on("stopVideo", async ({ sessionId }, callback) => {
    // Set session video property to null and send it to everyone in this session

    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      { video: null },
      { new: true, validateModifiedOnly: true }
    )
      .populate("host")
      .populate("speaker")
      .populate("people");

    io.in(sessionId).emit("stopVideo", {
      updatedSession: updatedSession,
    });

    const eventId = updatedSession.eventId;

    const registrations = await Registration.find({
      bookedForEventId: mongoose.Types.ObjectId(eventId),
    });

    let people = []; // Collection of {userId, socketId, camera, mic, screen}
    let uniquePeople = [];

    for (let element of updatedSession.onStagePeople) {
      for (let item of registrations) {
        console.log(element.user, item);
        if (item.bookedByUser) {
          if (element.user.toString() === item.bookedByUser.toString()) {
            if (!uniquePeople.includes(element.user)) {
              // Find socketId
              const { socketId } = await UsersInEvent.findOne({
                $and: [
                  { room: mongoose.Types.ObjectId(eventId) },
                  { userId: mongoose.Types.ObjectId(item.bookedByUser) },
                ],
              }).select("socketId");

              people.push({
                userId: item.bookedByUser,
                socketId: socketId,
                camera: element.camera,
                mic: element.microphone,
                screen: element.screen,
              });

              uniquePeople.push(element.user);
            }
          }
        }
      }
    }

    // 5.) Find everyone who is currently on stage with thier current camera, mic, screen, socket and userId (collection of objects)
    // * Now here we have required persons in people array

    // 6.) Tell everyone currently on stage to set => userHasUnmutedVideo.current = false; and userHasUnmutedAudio.current = false;

    console.log(people);

    let filteredPeople = [];

    let uniqueSocketIds = [];

    for (let item of people) {
      if (!uniqueSocketIds.includes(item.socketId)) {
        filteredPeople.push(item);
        uniqueSocketIds.push(item.socketId);
      }
    }

    for (let element of filteredPeople) {
      io.to(element.socketId).emit("resetAudioAndVideoControls");
    }

    // 7.) Everyone with their camera currently on should call unMuteMyVideo();
    for (let person of filteredPeople) {
      if (person.camera) {
        io.to(person.socketId).emit("unMuteYourVideo");
      }
    }
  });

  socket.on("startSession", async ({ sessionId }, callback) => {
    // Send start notification to everyone in this session and start 10 sec countdown

    const sessionDoc = await Session.findById(sessionId);

    sessionDoc.runningStatus = "Started";

    await sessionDoc.save({
      new: true,
      validateModifiedOnly: true,
    });

    const updatedSession = await Session.findById(sessionId)
      .populate("host")
      .populate("speaker")
      .populate("people");

    io.in(sessionId).emit("sessionStarted", {
      session: updatedSession,
    });
  });

  socket.on("pauseSession", async ({ sessionId }, callback) => {
    // Send pause session event to everyone and take to live stage and backstage as is appropriate

    const sessionDoc = await Session.findById(sessionId);

    sessionDoc.runningStatus = "Paused";

    // While pausing session please remove any attendee who is still on stage and send that user a notification
    // Please remember that their can be multiple attendees on stage at this time

    await OnLiveStagePeople.deleteMany({
      sessionId: mongoose.Types.ObjectId(sessionId),
    });
    await OnBackStagePeople.deleteMany({
      sessionId: mongoose.Types.ObjectId(sessionId),
    });

    await sessionDoc.save({ new: true, validateModifiedOnly: true });

    const updatedSession = await Session.findById(sessionId)
      .populate("host")
      .populate("speaker")
      .populate("people");

    io.in(sessionId).emit("sessionPaused", {
      session: updatedSession,
    });
  });

  socket.on("resumeSession", async ({ sessionId }, callback) => {
    // Send resume session event to everyone and take everyone to liveStage after 10 sec countdown

    const sessionDoc = await Session.findById(sessionId);

    sessionDoc.runningStatus = "Resumed";

    await sessionDoc.save({
      new: true,
      validateModifiedOnly: true,
    });

    const updatedSession = await Session.findById(sessionId)
      .populate("host")
      .populate("speaker")
      .populate("people");

    io.in(sessionId).emit("sessionResumed", {
      session: updatedSession,
    });
  });

  socket.on("endSession", async ({ sessionId }, callback) => {
    // Send end this session event to everyone in this session and show appropriate screens

    const sessionDoc = await Session.findById(sessionId);

    sessionDoc.runningStatus = "Ended";

    sessionDoc.onLiveStagePeople = [];
    sessionDoc.onBackStagePeople = [];

    await sessionDoc.save({ new: true, validateModifiedOnly: true });

    const updatedSession = await Session.findById(sessionId)
      .populate("host")
      .populate("speaker")
      .populate("people");

    io.in(sessionId).emit("sessionEnded", {
      session: updatedSession,
    });
  });

  socket.on("changeSessionColor", async ({ sessionId, color }, callback) => {
    // Set session color to newly allocated color and send this event back to everyone in this session

    const sessionDoc = await Session.findById(sessionId);

    sessionDoc.color = color;

    const updatedSession = await sessionDoc.save({
      new: true,
      validateModifiedOnly: true,
    });

    io.in(sessionId).emit("updatedSession", {
      updatedSession: updatedSession,
    });
  });

  socket.on("restoreDefaultSessionColor", async ({ sessionId }, callback) => {
    const sessionDoc = await Session.findById(sessionId);

    sessionDoc.color = null;

    const updatedSession = await sessionDoc.save({
      new: true,
      validateModifiedOnly: true,
    });

    io.in(sessionId).emit("updatedSession", {
      updatedSession: updatedSession,
    });
  });

  socket.on("changeSessionVibe", async ({ sessionId, vibeURL }, callback) => {
    // Set newly allocated vibe image url and this event back to everyone in this session

    const sessionDoc = await Session.findById(sessionId);

    sessionDoc.vibeURL = vibeURL;

    const updatedSession = await sessionDoc.save({
      new: true,
      validateModifiedOnly: true,
    });

    io.in(sessionId).emit("updatedSession", {
      updatedSession: updatedSession,
    });
  });

  socket.on("removeSessionVibe", async ({ sessionId }, callback) => {
    const sessionDoc = await Session.findById(sessionId);

    sessionDoc.vibeURL = null;

    const updatedSession = await sessionDoc.save({
      new: true,
      validateModifiedOnly: true,
    });

    io.in(sessionId).emit("updatedSession", {
      updatedSession: updatedSession,
    });
  });

  socket.on(
    "customizeSessionWidget",
    async ({ sessionId, widgets }, callback) => {
      // Set new session widgets preference and send it back to eveyone in this session

      const sessionDoc = await Session.findById(sessionId);

      sessionDoc.widgets = widgets;

      const updatedSession = await sessionDoc.save({
        new: true,
        validateModifiedOnly: true,
      });

      io.in(sessionId).emit("updatedSession", {
        updatedSession: updatedSession,
      });
    }
  );

  socket.on(
    "changeSessionLiveStreamSetting",
    async ({ sessionId, streamDestinations }, callback) => {
      // start or stop sending stream to other destinations as per session live stream settings

      const sessionDoc = await Session.findById(sessionId);

      sessionDoc.streamDestinations = streamDestinations;

      const updatedSession = await sessionDoc.save({
        new: true,
        validateModifiedOnly: true,
      });

      io.in(sessionId).emit("updatedSession", {
        updatedSession: updatedSession,
      });
    }
  );

  socket.on(
    "scheduleMeet",
    async (
      {
        title,
        shortDescription,
        startsAt,
        eventId,
        createdBy,
        participantIsAttending,
        participant,
        createdAt,
      },
      callback
    ) => {
      // create a schedule meet document and add it to the registration documents of both sender and reciever

      const scheduledMeet = await ScheduledMeet.create({
        title,
        shortDescription,
        createdAt,
        startsAt,
        participant,
        eventId,
        createdBy,
        participantIsAttending,
      });

      const populatedScheduledMeet = await ScheduledMeet.findById(
        scheduledMeet._id
      )
        .populate("createdBy")
        .populate("participant");

      // Find and Update both sender and recivers registration documents and update with this scheduledMeet

      const senderRegistration = await Registration.findOne({
        $and: [
          { bookedForEventId: mongoose.Types.ObjectId(eventId) },
          { bookedByUser: mongoose.Types.ObjectId(createdBy) },
        ],
      });

      senderRegistration.scheduledMeets.push(scheduledMeet._id);

      await senderRegistration.save({ new: true, validateModifiedOnly: true });

      const receiverRegistration = await Registration.findOne({
        $and: [
          { bookedForEventId: mongoose.Types.ObjectId(eventId) },
          { bookedByUser: mongoose.Types.ObjectId(participant) },
        ],
      });

      receiverRegistration.scheduledMeets.push(scheduledMeet._id);

      await receiverRegistration.save({
        new: true,
        validateModifiedOnly: true,
      });

      // Step 1. ) Find sender

      const SenderDoc = await UsersInEvent.findOne({
        $and: [
          { room: mongoose.Types.ObjectId(eventId) },
          { userId: mongoose.Types.ObjectId(createdBy) },
        ],
      });

      const senderSocket = SenderDoc.socketId; // ! Socket Id of sender

      // Step 2. ) Find reciever

      const RecieverDoc = await UsersInEvent.findOne({
        $and: [
          { room: mongoose.Types.ObjectId(eventId) },
          { userId: mongoose.Types.ObjectId(participant) },
        ],
      });

      const receiverSocket = RecieverDoc.socketId; // ! Socket Id of receiver

      // Send notification to both sender and receiver and send this scheduled meet document back on thier current socket Ids

      io.to(senderSocket).emit("meetingScheduled", {
        scheduledMeet: populatedScheduledMeet,
      });

      io.to(receiverSocket).emit("newMeetingInvite", {
        scheduledMeet: populatedScheduledMeet,
      });
    }
  );

  socket.on(
    "submitConnectionRequest",
    async ({ senderId, receiverId, eventId }, callback) => {
      // create a connection request document
      const newConnetionRequest = await ConnectionRequest.create({
        requestedByUser: senderId,
        requestedToUser: receiverId,
        eventId: eventId,
        status: "Pending",
        cancelled: false,
        createdAt: Date.now(),
      });

      const populatedConnectionRequest = await ConnectionRequest.findById(
        newConnetionRequest._id
      )
        .populate("requestedByUser")
        .populate("requestedToUser");

      // Add newly created connection request to sender's pending requests

      const senderDoc = await User.findById(senderId);

      senderDoc.pendingRequests.push(newConnetionRequest._id);

      await senderDoc.save({ new: true, validateModifiedOnly: true });

      // Add newly created connection request to receiver's pending connections

      const receiverDoc = await User.findById(senderId);

      receiverDoc.pendingConnections.push(newConnetionRequest._id);

      await receiverDoc.save({ new: true, validateModifiedOnly: true });

      // Step 1. ) Find sender

      const SenderDoc = await UsersInEvent.findOne({
        $and: [
          { room: mongoose.Types.ObjectId(eventId) },
          { userId: mongoose.Types.ObjectId(senderId) },
        ],
      });

      const senderSocket = SenderDoc.socketId; // ! Socket Id of sender

      // Step 2. ) Find reciever

      const RecieverDoc = await UsersInEvent.findOne({
        $and: [
          { room: mongoose.Types.ObjectId(eventId) },
          { userId: mongoose.Types.ObjectId(receiverId) },
        ],
      });

      const receiverSocket = RecieverDoc.socketId; // ! Socket Id of receiver

      // Send "connectionRequestSubmitted" event to senders socket with newly created connection request object

      io.to(senderSocket).emit("connectionRequestSubmitted", {
        newConnetionRequest: populatedConnectionRequest,
      });

      // Send "newConnectionRequest" event to receiver's socket with newly created connection request object

      io.to(receiverSocket).emit("newConnectionRequest", {
        newConnetionRequest: populatedConnectionRequest,
      });
    }
  );

  socket.on("getMyMeetings", async ({ userId, eventId }, callback) => {
    const { scheduledMeets } = await Registration.findOne({
      $and: [
        { bookedForEventId: mongoose.Types.ObjectId(eventId) },
        { bookedByUser: mongoose.Types.ObjectId(userId) },
      ],
    })
      .select("scheduledMeets")
      .populate({ path: "scheduledMeets", populate: { path: "createdBy" } });

    // Find socket Id of user who requested his scheduled meets

    const userDoc = await UsersInEvent.findOne({
      $and: [
        { room: mongoose.Types.ObjectId(eventId) },
        { userId: mongoose.Types.ObjectId(userId) },
      ],
    });

    const userSocket = userDoc.socketId; // ! Socket Id of user

    io.to(userSocket).emit("myMeetings", { meetings: scheduledMeets });
  });

  socket.on(
    "removeMeFromLoungeTable",
    async ({ chairId, tableId, userId, eventId }, callback) => {
      socket.join(tableId);
      console.log(chairId, tableId, userId, eventId);

      fetchCurrentRoomChairs = async () => {
        await Event.findById(eventId, (err, doc) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Sent lounge chair data");
            io.in(eventId).emit("roomChairData", { roomChairs: doc.chairs });
            socket.leave(tableId);
          }
        })
          .select("chairs")
          .populate("chairs");
      };

      // Remove this user from onStagePeople of this loungeTable

      const loungeTableDoc = await RoomTable.findOne({ tableId: tableId });

      console.log(loungeTableDoc.onStagePeople, "Before");
      console.log(chairId, tableId, userId, eventId);

      console.log("This is leave lounge table");

      loungeTableDoc.onStagePeople = loungeTableDoc.onStagePeople.filter(
        (people) => people.user.toString() !== userId.toString()
      );

      console.log(loungeTableDoc.onStagePeople, "After");

      await loungeTableDoc.save(
        {
          new: true,
          validateModifiedOnly: true,
        },
        async (err, updatedTable) => {
          io.to(tableId).emit("loungeTable", { loungeTable: updatedTable });
        }
      );

      const unOccupyChair = async ({ chairId, eventId, tableId }) => {
        await RoomChair.findOneAndUpdate(
          { chairId: chairId },
          {
            status: "Unoccupied",
            userId: null,
            userName: null,
            userEmail: null,
            userImage: null,
            userCity: null,
            userCountry: null,
            userOrganisation: null,
            userDesignation: null,
          },
          { new: true },
          async (err, updatedChair) => {
            if (err) {
              console.log(err);
            } else {
              console.log(updatedChair);
              await RoomTable.findOne({ tableId: tableId }, (err, tableDoc) => {
                if (err) {
                  console.log(err);
                } else {
                  tableDoc.numberOfPeople = tableDoc.numberOfPeople
                    ? tableDoc.numberOfPeople - 1
                    : 0;
                  tableDoc.save(
                    { validateModifiedOnly: true },
                    (err, updatedTableDoc) => {
                      if (err) {
                        console.log(err);
                      } else {
                        fetchCurrentRoomChairs(); // ! Listen To This event
                      }
                    }
                  );
                }
              });
            }
          }
        );
      };

      const { error } = unOccupyChair({ chairId, eventId, tableId });
    }
  );

  socket.on(
    "removeMeFromBoothTable",
    async ({ chairId, tableId, userId, eventId, boothId }, callback) => {
      socket.join(tableId);
      console.log(chairId, tableId, userId, eventId, boothId);
      fetchCurrentRoomChairs = async () => {
        await Booth.findById(boothId, (err, doc) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Sent booth chair data");
            io.in(boothId).emit("boothChairData", { roomChairs: doc.chairs });
            socket.leave(tableId);
          }
        })
          .select("chairs")
          .populate("chairs");
      };

      // Remove this user from onStagePeople of this boothTable

      const boothTableDoc = await BoothTable.findOne({ tableId: tableId });

      console.log(boothTableDoc.onStagePeople, "Before");
      console.log(chairId, tableId, userId, eventId, boothId);

      console.log("This is leave booth table");

      boothTableDoc.onStagePeople = boothTableDoc.onStagePeople.filter(
        (people) => people.user.toString() !== userId.toString()
      );

      console.log(boothTableDoc.onStagePeople, "After");

      await boothTableDoc.save(
        {
          new: true,
          validateModifiedOnly: true,
        },
        async (err, updatedTable) => {
          io.to(tableId).emit("boothTable", { boothTable: updatedTable });
        }
      );

      const unOccupyChair = async ({ chairId, eventId, boothId, tableId }) => {
        await BoothChair.findOneAndUpdate(
          { chairId: chairId },
          {
            status: "Unoccupied",
            userId: null,
            userName: null,
            userEmail: null,
            userImage: null,
            userCity: null,
            userCountry: null,
            userOrganisation: null,
            userDesignation: null,
          },
          { new: true },
          async (err, updatedChair) => {
            if (err) {
              console.log(err);
            } else {
              console.log(updatedChair);
              await BoothTable.findOne(
                { tableId: tableId },
                (err, tableDoc) => {
                  if (err) {
                    console.log(err);
                  } else {
                    tableDoc.numberOfPeople = tableDoc.numberOfPeople
                      ? tableDoc.numberOfPeople - 1
                      : 0;
                    tableDoc.save(
                      { validateModifiedOnly: true },
                      (err, updatedTableDoc) => {
                        if (err) {
                          console.log(err);
                        } else {
                          fetchCurrentRoomChairs(); // ! Listen To This event
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      };

      const { error } = unOccupyChair({ chairId, eventId, boothId, tableId });
    }
  );

  socket.on(
    "updateBoothChair",
    async (
      {
        eventId,
        boothId,
        tableId,
        chairId,
        userName,
        userId,
        userRole,
        userEmail,
        userImage,
        userCity,
        userCountry,
        userOrganisation,
        userDesignation,
        status,
      },
      callback
    ) => {
      socket.join(tableId);

      console.log("This is join booth table");

      fetchCurrentRoomChairs = async () => {
        await Booth.findById(boothId, (err, doc) => {
          if (err) {
            console.log(err);
          } else {
            io.to(boothId).emit("boothChairData", { roomChairs: doc.chairs });
          }
        })
          .select("chairs")
          .populate("chairs");
      };

      fetchNumberOfPeopleOnTable = async () => {
        await BoothTable.findOne({ tableId: tableId }, (err, tableDoc) => {
          if (err) {
            console.log(err);
          } else {
            io.to(tableId).emit("numberOfPeopleOnBoothTable", {
              numberOfPeopleOnTable: tableDoc.numberOfPeople,
            });
          }
        });
      };

      // Add this user to onStagePeople of this boothTable

      const boothTableDoc = await BoothTable.findOne({ tableId: tableId });

      boothTableDoc.onStagePeople.push({
        user: userId,
        role: userRole,
        camera: false,
        microphone: false,
        screen: false,
      });

      await boothTableDoc.save(
        {
          new: true,
          validateModifiedOnly: true,
        },
        async (err, updatedTable) => {
          io.to(tableId).emit("boothTable", { boothTable: updatedTable });
        }
      );

      const addUserToChair = async ({
        eventId,
        tableId,
        boothId,
        chairId,
        userId,
        userName,
        userRole,
        userEmail,
        userImage,
        userCity,
        userCountry,
        userOrganisation,
        userDesignation,
        status,
      }) => {
        const existingChair = await BoothChair.findOne(
          { chairId: chairId },
          async (err, existingChair) => {
            if (err) {
              console.log(err);
            } else {
              if (!existingChair) {
                await BoothChair.create(
                  {
                    status: "Occupied",
                    eventId: eventId,
                    boothId: boothId,
                    tableId: tableId,
                    chairId: chairId,
                    userId: userId,
                    userName: userName,
                    userRole: userRole,
                    userEmail: userEmail,
                    userImage: userImage,
                    userCity: userCity,
                    userCountry: userCountry,
                    userOrganisation: userOrganisation,
                    userDesignation: userDesignation,
                  },
                  async (err, newChair) => {
                    if (err) {
                      console.log(err);
                    } else {
                      const existingTable = await BoothTable.findOne(
                        { tableId: tableId },
                        async (err, tableDoc) => {
                          if (err) {
                            console.log(err);
                          } else {
                            tableDoc.numberOfPeople =
                              tableDoc.numberOfPeople + 1;

                            tableDoc.save(
                              { validateModifiedOnly: true },
                              (err, updatedTableDoc) => {
                                if (err) {
                                  console.log(err);
                                } else {
                                  // * DONE call fetchNumberOfPeopleOnTable
                                  fetchNumberOfPeopleOnTable();
                                }
                              }
                            );
                          }
                        }
                      );

                      await Booth.findById(boothId, async (err, boothDoc) => {
                        if (err) {
                          console.log(err);
                        } else {
                          boothDoc.chairs.push(newChair._id);
                          await boothDoc.save(
                            { validateModifiedOnly: true },
                            async (err, updatedBoothDoc) => {
                              if (err) {
                                console.log(err);
                              } else {
                                fetchCurrentRoomChairs();
                              }
                            }
                          );
                        }
                      });
                    }
                  }
                );
              } else {
                // Write what to do when chair already exists

                await BoothTable.findOne(
                  { tableId: tableId },
                  async (err, tableDoc) => {
                    if (err) {
                      console.log(err);
                    } else {
                      tableDoc.numberOfPeople = tableDoc.numberOfPeople + 1;
                      tableDoc.save(
                        { validateModifiedOnly: true },
                        (err, updatedTableDoc) => {
                          if (err) {
                            console.log(err);
                          } else {
                            // * DONE call fetchNumberOfPeopleOnTable
                            fetchNumberOfPeopleOnTable();
                          }
                        }
                      );
                    }
                  }
                );

                existingChair.status = "Occupied";
                existingChair.userId = userId;
                existingChair.userName = userName;
                existingChair.userEmail = userEmail;
                existingChair.userRole = userRole;
                existingChair.userImage = userImage;
                existingChair.userCity = userCity;
                existingChair.userCountry = userCountry;
                existingChair.userDesignation = userDesignation;
                existingChair.userOrganisation = userOrganisation;

                existingChair.save(
                  { validateModifiedOnly: true },
                  async (err, updatedChair) => {
                    if (err) {
                      console.log(err);
                    } else {
                      fetchCurrentRoomChairs();
                    }
                  }
                );
              }
            }
          }
        );
      };

      const { error } = addUserToChair({
        eventId: eventId,
        tableId: tableId,
        chairId: chairId,
        boothId: boothId,
        userName: userName,
        userId: userId,
        userEmail: userEmail,
        userRole: userRole,
        userImage: userImage,
        userCity: userCity,
        userCountry: userCountry,
        userOrganisation: userOrganisation,
        userDesignation: userDesignation,
        status: status,
      });
    }
  );

  socket.on(
    "updateChair",
    async (
      {
        eventId,
        tableId,
        chairId,
        userId,
        userName,
        userRole,
        userEmail,
        userImage,
        userCity,
        userCountry,
        userOrganisation,
        userDesignation,
        status,
      },
      callback
    ) => {
      socket.join(tableId);

      console.log("This is join lounge table");

      fetchCurrentRoomChairs = async () => {
        await Event.findById(eventId, (err, doc) => {
          if (err) {
            console.log(err);
          } else {
            io.in(eventId).emit("roomChairData", { roomChairs: doc.chairs });
          }
        })
          .select("chairs")
          .populate("chairs");
      };

      fetchNumberOfPeopleOnTable = async () => {
        await RoomTable.findOne({ tableId: tableId }, (err, tableDoc) => {
          if (err) {
            console.log(err);
          } else {
            io.in(tableId).emit("numberOfPeopleOnTable", {
              numberOfPeopleOnTable: tableDoc.numberOfPeople,
            });
          }
        });
      };

      // Add this user to onStagePeople of this loungeTable

      const loungeTableDoc = await RoomTable.findOne({ tableId: tableId });

      loungeTableDoc.onStagePeople.push({
        user: userId,
        role: userRole,
        camera: false,
        microphone: false,
        screen: false,
      });

      await loungeTableDoc.save(
        { new: true, validateModifiedOnly: true },
        async (err, updatedTable) => {
          io.in(tableId).emit("loungeTable", { loungeTable: updatedTable });
        }
      );

      const addUserToChair = async ({
        eventId,
        tableId,
        chairId,
        userId,
        userName,
        userRole,
        userEmail,
        userImage,
        userCity,
        userCountry,
        userOrganisation,
        userDesignation,
        status,
      }) => {
        const existingChair = await RoomChair.findOne(
          { chairId: chairId },
          async (err, existingChair) => {
            if (err) {
              console.log(err);
            } else {
              if (!existingChair) {
                // Write what to do when chair is not existing

                await RoomChair.create(
                  {
                    status: "Occupied",
                    eventId: eventId,
                    tableId: tableId,
                    chairId: chairId,
                    userId: userId,
                    userName: userName,
                    userRole: userRole,
                    userEmail: userEmail,
                    userImage: userImage,
                    userCity: userCity,
                    userCountry: userCountry,
                    userOrganisation: userOrganisation,
                    userDesignation: userDesignation,
                  },
                  async (err, newChair) => {
                    if (err) {
                      console.log(err);
                    } else {
                      const existingTable = await RoomTable.findOne(
                        { tableId: tableId },
                        async (err, tableDoc) => {
                          if (err) {
                            console.log(err);
                          } else {
                            tableDoc.numberOfPeople =
                              tableDoc.numberOfPeople + 1;
                            tableDoc.save(
                              { validateModifiedOnly: true },
                              (err, updatedTableDoc) => {
                                if (err) {
                                  console.log(err);
                                } else {
                                  // * DONE call fetchNumberOfPeopleOnTable
                                  fetchNumberOfPeopleOnTable();
                                }
                              }
                            );
                          }
                        }
                      );

                      await Event.findById(eventId, async (err, eventDoc) => {
                        if (err) {
                          console.log(err);
                        } else {
                          eventDoc.chairs.push(newChair._id);

                          await eventDoc.save(
                            { validateModifiedOnly: true },
                            async (err, updatedEventDoc) => {
                              if (err) {
                                console.log(err);
                              } else {
                                fetchCurrentRoomChairs();
                              }
                            }
                          );
                        }
                      });
                    }
                  }
                );
              } else {
                // Write what to do when chair already exists

                await RoomTable.findOne(
                  { tableId: tableId },
                  (err, tableDoc) => {
                    if (err) {
                      console.log(err);
                    } else {
                      tableDoc.numberOfPeople = tableDoc.numberOfPeople + 1;
                      tableDoc.save(
                        { validateModifiedOnly: true },
                        (err, updatedTableDoc) => {
                          if (err) {
                            console.log(err);
                          } else {
                            // * DONE call fetchNumberOfPeopleOnTable
                            fetchNumberOfPeopleOnTable();
                          }
                        }
                      );
                    }
                  }
                );

                existingChair.status = "Occupied";
                existingChair.userId = userId;
                existingChair.userName = userName;
                existingChair.userEmail = userEmail;
                existingChair.userRole = userRole;
                existingChair.userImage = userImage;
                existingChair.userCity = userCity;
                existingChair.userCountry = userCountry;
                existingChair.userDesignation = userDesignation;
                existingChair.userOrganisation = userOrganisation;

                existingChair.save(
                  { validateModifiedOnly: true },
                  async (err, updatedChair) => {
                    if (err) {
                      console.log(err);
                    } else {
                      fetchCurrentRoomChairs();
                    }
                  }
                );
              }
            }
          }
        );
      };

      const { error } = addUserToChair({
        eventId: eventId,
        tableId: tableId,
        chairId: chairId,
        userName: userName,
        userId: userId,
        userEmail: userEmail,
        userRole: userRole,
        userImage: userImage,
        userCity: userCity,
        userCountry: userCountry,
        userOrganisation: userOrganisation,
        userDesignation: userDesignation,
        status: status,
      });
    }
  );

  socket.on(
    "join",
    async (
      {
        email,
        eventId,
        userId,
        userName,
        userImage,
        userCity,
        userCountry,
        userOrganisation,
        userDesignation,
        userRole,
      },
      callback
    ) => {
      socket.join(eventId);

      const eventDoc = await Event.findById(eventId);

      // Make sure to remove this person from people array in event before pushing him/her in again

      eventDoc.people = eventDoc.people.filter(
        (el) => el._id.toString() !== userId.toString()
      );

      eventDoc.people.push(userId);

      await eventDoc.save({ new: true, validateModifiedOnly: true });

      // Send updated event to everyone in this event right now

      const updatedEvent = await Event.findById(eventId)
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
          select:
            "name socialMediaHandles image email superAdmin eventManagers",
        })
        .populate({
          path: "coupon",
          options: {
            match: { status: "Active" },
          },
        })
        .populate("hosts")
        .populate("people");

      io.in(eventId).emit("updatedEvent", { event: updatedEvent });

      const fetchCurrentMessages = async (eventId) => {
        const populatedEventChats = await EventChatMessage.find(
          { eventId: mongoose.Types.ObjectId(eventId) },
          (err, doc) => {
            // console.log(doc);
            if (err) {
              console.log(err);
            } else {
              io.to(eventId).emit("previousEventMessages", {
                chats: doc,
              });
            }
          }
        ).populate("replyTo");
      };

      fetchCurrentMessages(eventId);

      const fetchCurrentUsers = async (eventId) => {
        await UsersInEvent.find(
          { room: mongoose.Types.ObjectId(eventId) },
          (err, doc) => {
            io.in(eventId).emit("roomData", { users: doc });
          }
        );
      };

      const addUser = async ({
        id,
        email,
        room,
        userId,
        userName,
        userImage,
        userCity,
        userCountry,
        userOrganisation,
        userDesignation,
      }) => {
        const existingUser = await UsersInEvent.findOne(
          {
            $and: [
              { userId: new mongoose.Types.ObjectId(userId) },
              { room: mongoose.Types.ObjectId(room) },
            ],
          },
          async (error, existingUser) => {
            console.log("error", error);

            let mongoUser;

            if (!existingUser) {
              mongoUser = await UsersInEvent.create(
                {
                  room: room,
                  socketId: id,
                  userId: userId,
                  userEmail: email,
                  userName: userName,
                  userImage: userImage,
                  userCity: userCity,
                  userCountry: userCountry,
                  userOrganisation: userOrganisation,
                  userDesignation: userDesignation,
                },
                async (err, doc) => {
                  console.log("error: ", err);

                  if (!existingUser) {
                    fetchCurrentUsers(eventId);
                  }
                }
              );
            } else {
              await UsersInEvent.findOneAndUpdate(
                {
                  $and: [
                    { userId: mongoose.Types.ObjectId(userId) },
                    { room: mongoose.Types.ObjectId(eventId) },
                  ],
                },
                {
                  status: "Active",
                  socketId: id,
                  userEmail: email,
                  userName: userName,
                  userImage: userImage,
                  userCity: userCity,
                  userCountry: userCountry,
                  userOrganisation: userOrganisation,
                  userDesignation: userDesignation,
                }, // Mark as active and update socket Id
                { new: true },
                (err, doc) => {
                  if (err) {
                    console.log(err);
                  } else {
                    fetchCurrentUsers(eventId);
                  }
                }
              );
            }
          }
        );

        if (!room || !email) return { error: "email and room are required." };
      };

      const { error } = addUser({
        id: socket.id,
        email: email,
        room: eventId,
        userId: userId,
        userName: userName,
        userImage: userImage,
        userCity: userCity,
        userCountry: userCountry,
        userOrganisation: userOrganisation,
        userDesignation: userDesignation,
      });

      if (error) return callback(error);

      callback();
    }
  );

  socket.on(
    "joinSession",
    async (
      {
        userId,
        sessionId,
        sessionRole,
        userName,
        userEmail,
        userImage,
        userCity,
        userCountry,
        userOrganisation,
        userDesignation,
        roleToBeDisplayed,
      },
      callback
    ) => {
      socket.join(sessionId);

      // Make sure to remove user from people if already present then

      const sessionDoc = await Session.findById(sessionId);

      sessionDoc.people = sessionDoc.people.filter(
        (person) => person._id.toString() !== userId.toString()
      );

      sessionDoc.people.push(userId);

      await sessionDoc.save({ new: true, validateModifiedOnly: true });

      const updatedSession = await Session.findById(sessionId)
        .populate("host")
        .populate("speaker")
        .populate("people");

      io.to(sessionId).emit("updatedSession", {
        updatedSession: updatedSession,
      });

      const fetchCurrentUsersInSession = async (sessionId) => {
        await UsersInSession.find(
          { room: mongoose.Types.ObjectId(sessionId) },
          (err, doc) => {
            io.in(sessionId).emit("usersInSession", {
              users: doc,
            });
          }
        );
      };

      const addUserInSession = async ({
        id,
        userId,
        room,
        sessionRole,
        userName,
        userEmail,
        userImage,
        userCity,
        userCountry,
        userOrganisation,
        userDesignation,
        roleToBeDisplayed,
      }) => {
        const existingUser = await UsersInSession.findOne(
          {
            $and: [
              { userId: new mongoose.Types.ObjectId(userId) },
              { room: new mongoose.Types.ObjectId(room) },
            ],
          },
          async (err, existingUser) => {
            if (err) {
              console.log(err);
            }

            if (!existingUser) {
              await UsersInSession.create(
                {
                  room: room,
                  socketId: id,
                  sessionRole: sessionRole,
                  userId: userId,
                  userEmail: userEmail,
                  userName: userName,
                  userImage: userImage,
                  userCity: userCity,
                  userCountry: userCountry,
                  userOrganisation: userOrganisation,
                  userDesignation: userDesignation,
                  roleToBeDisplayed: roleToBeDisplayed,
                },
                async (err, doc) => {
                  if (err) {
                    console.log(err);
                  } else {
                    fetchCurrentUsersInSession(sessionId);
                  }
                }
              );
            } else {
              await UsersInSession.findOneAndUpdate(
                {
                  $and: [
                    { userId: mongoose.Types.ObjectId(userId) },
                    { room: mongoose.Types.ObjectId(sessionId) },
                  ],
                },
                {
                  status: "Active",
                  socketId: id,
                  sessionRole: sessionRole,
                  userId: userId,
                  userEmail: userEmail,
                  userName: userName,
                  userImage: userImage,
                  userCity: userCity,
                  userCountry: userCountry,
                  userOrganisation: userOrganisation,
                  userDesignation: userDesignation,
                  roleToBeDisplayed: roleToBeDisplayed,
                },
                { new: true },
                (err, doc) => {
                  if (err) {
                    console.log(err);
                  } else {
                    fetchCurrentUsersInSession(sessionId);
                  }
                }
              );
            }
          }
        );
      };

      const { error } = addUserInSession({
        id: socket.id,
        userId: userId,
        room: sessionId,
        sessionRole: sessionRole,
        userName: userName,
        userEmail: userEmail,
        userImage: userImage,
        userCity: userCity,
        userCountry: userCountry,
        userOrganisation: userOrganisation,
        userDesignation: userDesignation,
        roleToBeDisplayed: roleToBeDisplayed,
      });
    }
  );

  socket.on(
    "setSessionRunningStatus",
    async ({ sessionId, eventId, sessionRunningStatus }, callback) => {
      await Session.findByIdAndUpdate(
        sessionId,
        { runningStatus: sessionRunningStatus },
        { new: true },
        (err, doc) => {
          if (err) {
            console.log(err);
          } else {
            // transmit to whole event
            io.to(eventId).emit("updatedSession", {
              updatedSession: doc,
            });

            // transmit to people currently in session
            io.to(sessionId).emit("updatedCurrentSession", {
              session: doc,
            });
          }
        }
      )
        .populate("host")
        .populate("speaker")
        .populate("people");
      callback();
    }
  );

  socket.on("updatePoll", async ({ userId, selectedPoll, selectedOption }) => {
    await EventPoll.findById(selectedPoll, async (err, pollDoc) => {
      if (err) {
        console.log(err);
      } else {
        pollDoc.answeredBy.push(userId);
        switch (selectedOption) {
          case "option_1":
            pollDoc.option_1_count++;
            break;
          case "option_1":
            pollDoc.option_2_count++;
            break;
          case "option_1":
            pollDoc.option_3_count++;
            break;
          case "option_1":
            pollDoc.option_4_count++;
            break;
          default:
            break;
        }
        pollDoc.save(
          { validateModifiedOnly: true },
          async (err, updatedPollDoc) => {
            if (err) {
              console.log(err);
            } else {
              const eventId = updatedPollDoc.eventId;
              io.in(eventId).emit("updatedEventPoll", {
                updatedPoll: updatedPollDoc,
              });
            }
          }
        );
      }
    });
  });

  socket.on(
    "transmitEventPoll",
    async ({
      question,
      answer_1,
      answer_2,
      answer_3,
      answer_4,
      expiresAt,
      eventId,
      hostId,
      hostFirstName,
      hostLastName,
      hostEmail,
      hostImage,
      organisation,
      designation,
    }) => {
      await EventPoll.create(
        {
          question: question,
          option_1: answer_1,
          option_2: answer_2,
          option_3: answer_3,
          option_4: answer_4,
          expiresAt: expiresAt,
          eventId: eventId,
          hostId: hostId,
          hostFirstName: hostFirstName,
          hostLastName: hostLastName,
          hostEmail: hostEmail,
          hostImage: hostImage,
          organisation: organisation,
          designation: designation,
        },
        async (err, eventPollDoc) => {
          if (err) {
            console.log(err);
          } else {
            await Event.findById(eventId, async (err, eventDoc) => {
              if (err) {
                console.log(err);
              } else {
                eventDoc.polls.push(eventPollDoc._id);

                await eventDoc.save(
                  { validateModifiedOnly: true },
                  (err, data) => {
                    if (err) {
                      console.log(err);
                    } else {
                      io.in(eventId).emit("newEventPoll", {
                        newPoll: eventPollDoc,
                      });
                    }
                  }
                );
              }
            });
          }
        }
      );
    }
  );

  socket.on("createAlert", async ({ userId, alertText, eventId }, callback) => {
    // Create and send alert to everyone in this event

    const newAlert = await EventAlert.create({
      alertMsg: alertText,
      eventId: eventId,
      userId: userId,
      createdAt: Date.now(),
    });

    const eventAlertDoc = await EventAlert.findById(newAlert._id).populate(
      "userId"
    );

    io.in(eventId).emit("newEventAlert", { newAlert: eventAlertDoc });
  });

  socket.on("deleteAlert", async ({ alertId, userId, eventId }, callback) => {
    // Mark alert as deleted and emit event to remove this alert from state to everyone in this event

    await EventAlert.findByIdAndUpdate(
      alertId,
      { deleted: true },
      { new: true, validateModifiedOnly: true }
    );

    // Find socket Id of user who deleted this alert and send him/her a confirmation

    const UserDoc = await UsersInEvent.findOne({
      $and: [
        { room: mongoose.Types.ObjectId(eventId) },
        { userId: mongoose.Types.ObjectId(userId) },
      ],
    });

    const userSocket = UserDoc.socketId; // ! Socket Id of sender

    io.to(userSocket).emit("alertDeletedConfirmed");

    io.in(eventId).emit("deleteAlert", { alertId: alertId });
  });

  socket.on(
    "transmitPersonalMessage",
    async ({
      // Here get all transmitted properties
      // Recieve Id of both sender and reciever
      isReply,
      replyTo,
      textMessage,
      eventId,
      createdAt,
      senderRole,
      senderName,
      senderEmail,
      senderImage,
      senderOrganisation,
      senderDesignation,
      reported,
      visibilityStatus,
      senderId, // * Sender Id
      receiverId, // * Reciever Id
    }) => {
      console.log(receiverId);
      // * Find current socketId of both sender and reciever

      // Step 1. ) Find sender

      const SenderDoc = await UsersInEvent.findOne({
        $and: [
          { room: mongoose.Types.ObjectId(eventId) },
          { userId: mongoose.Types.ObjectId(senderId) },
        ],
      });

      const senderSocket = SenderDoc.socketId; // ! Socket Id of sender

      // Step 2. ) Find reciever

      const RecieverDoc = await UsersInEvent.findOne({
        $and: [
          { room: mongoose.Types.ObjectId(eventId) },
          { userId: mongoose.Types.ObjectId(receiverId) },
        ],
      });

      const recieverSocket = RecieverDoc.socketId; // ! Socket Id of reciver

      // * Create a new chat message in personal chat document for both sender and reciever and send newly created msg doc to both sender and reciever

      // Step 3.) Create new personal message for sender & reciever => Yes there will be only one msg as it includes both of them

      const newChat = await PersonalChat.create({
        textMessage,
        isReply,
        replyTo,
        eventId,
        visibilityStatus,
        createdAt: Date.now(),
        senderId: senderId,
        receiverId,
        senderRole,
        senderName,
        senderEmail,
        senderImage,
        senderOrganisation,
        senderDesignation,
        reported,
      });

      // * Send Newly created chats to both sender and reciever socket

      // Step 4.) Send message to sender

      io.to(senderSocket).emit("newPersonalMessage", {
        newChat: newChat,
      });

      // Step 5.) Send message to reciever

      io.to(recieverSocket).emit("newPersonalMessage", {
        newChat: newChat,
      });
      // Close the connection => private messaging successful.
    }
  );

  socket.on(
    "transmitTableMessage",
    async ({
      isReply,
      replyTo,
      textMessage,
      eventId,
      tableId,
      createdAt,
      userRole,
      userName,
      userEmail,
      userImage,
      userOrganisation,
      userDesignation,
      userId,
      reported,
      numOfTimesReported,
      visibilityStatus,
    }) => {
      await TableChats.create(
        {
          isReply,
          textMessage,
          eventId,
          tableId,
          createdAt,
          userRole,
          userName,
          userEmail,
          userImage,
          userOrganisation,
          userDesignation,
          userId,
          reported,
          numOfTimesReported,
          visibilityStatus,
        },
        async (err, chatMsgDoc) => {
          if (err) {
            console.log(err);
          } else {
            if (isReply) {
              chatMsgDoc.replyTo = replyTo;
              await chatMsgDoc.save({ new: true, validateModifiedOnly: true });
            }

            const populatedChatMsg = await TableChats.find({
              tableId: tableId,
            }).populate("replyTo");

            io.in(tableId).emit("newTableMsg", {
              chats: populatedChatMsg,
            });
          }
        }
      );
    }
  );

  socket.on(
    "transmitEventMessage",
    async ({
      isReply,
      replyTo,
      textMessage,
      eventId,
      createdAt,
      userRole,
      userName,
      userEmail,
      userImage,
      userOrganisation,
      userDesignation,
      userId,
      reported,
      numOfTimesReported,
      visibilityStatus,
    }) => {
      await EventChatMessage.create(
        {
          isReply,
          textMessage,
          eventId,
          createdAt,
          userRole,
          userName,
          userEmail,
          userImage,
          userOrganisation,
          userDesignation,
          userId,
          reported,
          numOfTimesReported,
          visibilityStatus,
        },
        async (err, chatMsgDoc) => {
          if (err) {
            console.log(err);
          } else {
            if (isReply) {
              chatMsgDoc.replyTo = replyTo;
              await chatMsgDoc.save({ new: true, validateModifiedOnly: true });
            }
            await Event.findById(eventId, async (err, eventDoc) => {
              if (err) {
                console.log(err);
              } else {
                eventDoc.chatMessages.push(chatMsgDoc._id);
                const populatedChatMsg = await EventChatMessage.findById(
                  chatMsgDoc._id
                ).populate("replyTo");

                eventDoc.save({ validateModifiedOnly: true }, (err, data) => {
                  if (err) {
                    console.log(err);
                  } else {
                    io.in(eventId).emit("newEventMsg", {
                      newMsg: populatedChatMsg,
                    });
                  }
                });
              }
            });
          }
        }
      );
    }
  );

  socket.on("deleteEventMessage", async ({ msgId, eventId }) => {
    await EventChatMessage.findByIdAndUpdate(msgId, { deleted: true });

    await EventChatMessage.find(
      { eventId: mongoose.Types.ObjectId(eventId) },
      async (err, doc) => {
        io.in(eventId).emit("previousEventMessages", {
          chats: doc,
        });
      }
    ).populate("replyTo");
  });

  socket.on("deleteTableMessage", async ({ msgId, tableId }) => {
    await TableChats.findByIdAndUpdate(msgId, { deleted: true });

    await TableChats.find({ tableId: tableId }, async (err, doc) => {
      io.in(tableId).emit("updateTableChats", {
        chats: doc,
      });
    }).populate("replyTo");
  });

  socket.on("leaveSession", async ({ userId, sessionId }) => {
    socket.leave(sessionId);

    const sessionDoc = await Session.findById(sessionId);

    sessionDoc.people = sessionDoc.people.filter(
      (person) => person._id.toString() !== userId.toString()
    );

    await sessionDoc.save({ new: true, validateModifiedOnly: true });

    const updatedSession = await Session.findById(sessionId)
      .populate("host")
      .populate("speaker")
      .populate("people");

    io.to(sessionId).emit("updatedSession", {
      updatedSession: updatedSession,
    });

    await UsersInSession.findOneAndUpdate(
      {
        $and: [
          { room: mongoose.Types.ObjectId(sessionId) },
          { userId: mongoose.Types.ObjectId(userId) },
        ],
      },
      { status: "Inactive", socketId: null },
      { new: true, validateModifiedOnly: true }
    );

    // Find all users in this session and send this list of updated users to everyone in this session

    await UsersInSession.find(
      { room: mongoose.Types.ObjectId(sessionId) },
      (err, doc) => {
        io.in(sessionId).emit("usersInSession", {
          users: doc,
        });
      }
    );
  });

  socket.on("leaveEvent", async ({ userId, eventId }) => {
    socket.leave(eventId);

    const eventDoc = await Event.findById(eventId);

    eventDoc.people = eventDoc.people.filter(
      (person) => person._id.toString() !== userId.toString()
    );

    await eventDoc.save({ new: true, validateModifiedOnly: true });

    // Send updated doc to everyone in this event

    const updatedEvent = await Event.findById(eventId)
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
      .populate("people");

    io.in(eventId).emit("updatedEvent", { event: updatedEvent });

    await UsersInEvent.findOneAndUpdate(
      {
        $and: [
          { room: mongoose.Types.ObjectId(eventId) },
          { userId: mongoose.Types.ObjectId(userId) },
        ],
      },
      { status: "Inactive" },
      { new: true, validateModifiedOnly: true }
    );

    await UsersInEvent.find(
      { room: mongoose.Types.ObjectId(eventId) },
      (err, doc) => {
        io.in(eventId).emit("roomData", {
          users: doc,
        });
      }
    );
  });

  socket.on("loggingInUser", async ({ email, password }) => {
    if (!email || !password) {
      socket.emit("emailOrPasswordNotCorrect");
      return;
    }

    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      socket.emit("emailOrPasswordNotCorrect");
      return;
    }

    const isUserLoggedInAlready = await LoggedInUsers.find({
      userId: user._id,
    });

    if (isUserLoggedInAlready.length > 0) {
      socket.broadcast.emit("logOutUser", {
        userId: user._id,
        message: "You have been logged In from Other device",
      });
      await LoggedInUsers.findOneAndDelete({
        userId: user.userId,
      });
    }

    await LoggedInUsers.create({
      userId: user._id,
    });

    const token = signToken(user._id);

    user.password = undefined;
    socket.emit("newLogin", {
      token,
      data: { user },
    });
  });

  socket.on("googleSignIn", async ({ ModifiedFormValues }) => {
    const { googleId, firstName, lastName, image, email, referralCode } =
      ModifiedFormValues;
    const user = await User.findOne({ email: email });
    if (user) {
      const isUserLoggedInAlready = await LoggedInUsers.find({
        userId: user._id,
      });

      if (isUserLoggedInAlready.length > 0) {
        socket.broadcast.emit("logOutUser", {
          userId: user._id,
          message: "You have been logged In from Other device",
        });
        await LoggedInUsers.findOneAndDelete({
          userId: user.userId,
        });
      }

      await LoggedInUsers.create({
        userId: user._id,
      });

      const token = signToken(user._id);

      socket.emit("newGoogleLogin", {
        token,
        data: { user },
      });
    } else {
      // Create new referral code
      const MyReferralCode = nanoid(10);

      let referrer;
      if (referralCode) {
        referrer = await User.findOneAndUpdate(
          { referralCode: referralCode },

          { $inc: { signupUsingReferral: 1 } },

          {
            new: true,
            validateModifiedOnly: true,
          }
        );

        if (referrer) {
          const user = await new User({
            googleId: googleId,
            email: email,
            firstName: firstName,
            lastName: lastName,
            policySigned: true,
            referralCode: MyReferralCode,
            subscribedToMailList: true,
            image: image,
            referrer: referrer._id,
            signupUsingReferral: 0,
            upgrades: 0,
            credit: 0,
          }).save({ validateModifiedOnly: true });
          const name = `${firstName} ${lastName}`;
          await MailList.create({
            name: name,
            email: email,
          });
          await LoggedInUsers.create({
            userId: user._id,
          });

          const teamInvites = await TeamInvite.find({
            invitedUserEmail: email,
          });

          for (let element of teamInvites) {
            const status = element.status;

            const userEmail = element.invitedUserEmail;

            const communityId = element.communityId;

            const userDoc = user;

            const CommunityDoc = await Community.findById(communityId).populate(
              "eventManagers",
              "email"
            );

            // accept team invitaion

            // Push this persons userId in eventManagers array in community
            CommunityDoc.eventManagers.push(userDoc._id);
            await CommunityDoc.save({ new: true, validateModifiedOnly: true });

            // add this community in this users doc in invited communities array
            userDoc.invitedCommunities.push(communityId);
            await userDoc.save({ new: true, validateModifiedOnly: true });

            // Mark this invitation document status as accepted
            element.status = "Accepted";
            await element.save({ new: true, validateModifiedOnly: true });

            // TODO For every team invitation accepted please send a confirmation mail to user and community super admin

            // Team invitation accepted
          }

          // * DONE At this point we are sure that we have accepted all pending team invitations

          // Get all speaker registrations that are still pending and not cancelled for this users email

          const speakerRegistrations = await Registration.find({
            $and: [
              { type: "Speaker" },
              { status: "Pending" },
              { cancelled: false },
              { userEmail: email },
            ],
          });

          const speakers = await Speaker.find({
            email: email,
          });

          for (let element of speakers) {
            element.userId = user._id;
            await element.save({ new: true, validateModifiedOnly: true });
          }

          // Now we have all speaker registrations for this user which are still pending and not cancelled

          for (let element of speakerRegistrations) {
            // For every registration add it to user registered events and push each registration into user document

            const userDoc = user;

            userDoc.registeredInEvents.push(element.bookedForEventId);
            userDoc.registrations.push(element._id);

            // update each registration as completed and fill details like user Id and other user details that are needed

            element.status = "Completed";
            element.userName = userDoc.firstName + " " + userDoc.lastName;
            element.userImage = userDoc.image;
            element.bookedByUser = userDoc._id;
            element.first_name = userDoc.firstName;
            element.lastName = userDoc.lastName;
            element.name = userDoc.firstName + " " + userDoc.lastName;
            element.organisation = userDoc.organisation;
            element.designation = userDoc.designation;
            element.city = userDoc.city;
            element.country = userDoc.country;

            // Save all updates in userDoc and registration doc.
            await userDoc.save({ new: true, validateModifiedOnly: true });
            await element.save({ new: true, validateModifiedOnly: true });

            // TODO For every speaker invitation accepted please send a confirmation mail to user

            // Speaker invitation accepted
          }

          // * DONE At this point we are sure that we have accepted all pending speaker invitations

          const boothRegistrations = await Registration.find({
            $and: [
              { type: "Exhibitor" },
              { status: "Pending" },
              { cancelled: false },
              { userEmail: email },
            ],
          });

          // Now we have all booth registrations for this user which are still pending and not cancelled

          for (let element of boothRegistrations) {
            // For every registration add it to user registered events and push each registration into user document

            const userDoc = user;

            userDoc.registeredInEvents.push(element.bookedForEventId);
            userDoc.registrations.push(element._id);

            // update each registration as completed and fill details like user Id and other user details that are needed

            element.status = "Completed";
            element.userName = userDoc.firstName + " " + userDoc.lastName;
            element.userImage = userDoc.image;
            element.bookedByUser = userDoc._id;
            element.first_name = userDoc.firstName;
            element.lastName = userDoc.lastName;
            element.name = userDoc.firstName + " " + userDoc.lastName;
            element.organisation = userDoc.organisation;
            element.designation = userDoc.designation;
            element.city = userDoc.city;
            element.country = userDoc.country;

            // Save all updates in userDoc and registration doc.
            await userDoc.save({ new: true, validateModifiedOnly: true });
            await element.save({ new: true, validateModifiedOnly: true });

            // TODO For every booth invitation accepted please send a confirmation mail to user

            // Booth invitation accepted
          }

          // * DONE At this point we are sure that we have accepted all pending booth invitations

          const token = signToken(user._id);

          socket.emit("newGoogleLogin", {
            token,
            data: { user },
          });

          const msg = {
            to: user.email, // Change to your recipient
            from: "shreyanshshah242@gmail.com", // Change to your verified sender
            subject: `Welcome to Bluemeet`,
            text: ` We are glad to have you on Bluemeet. Our customer success team will be in touch with you shortly for helping you discover and unleash power of virtual and hybrid events. In the meantime you can go through these resources to do a self exploration of Bluemeet platform. Cheers!`,
            html: WelcomeToBluemeet(),
          };

          sgMail
            .send(msg)
            .then(async () => {
              console.log("Welcome mail sent successfully!");
            })
            .catch(async (error) => {
              console.log("Failed to send welcome message to our user.");
            });
        } else {
          // !What happens if there is no referrer document found

          const user = await new User({
            googleId: googleId,
            email: email,
            firstName: firstName,
            lastName: lastName,
            policySigned: true,
            referralCode: MyReferralCode,
            subscribedToMailList: true,
            image: image,
            signupUsingReferral: 0,
            upgrades: 0,
            credit: 0,
          }).save({ validateModifiedOnly: true });
          const name = `${firstName} ${lastName}`;
          await MailList.create({
            name: name,
            email: email,
          });
          await LoggedInUsers.create({
            userId: user._id,
          });

          const teamInvites = await TeamInvite.find({
            invitedUserEmail: email,
          });

          for (let element of teamInvites) {
            const status = element.status;

            const userEmail = element.invitedUserEmail;

            const communityId = element.communityId;

            const userDoc = user;

            const CommunityDoc = await Community.findById(communityId).populate(
              "eventManagers",
              "email"
            );

            // accept team invitaion

            // Push this persons userId in eventManagers array in community
            CommunityDoc.eventManagers.push(userDoc._id);
            await CommunityDoc.save({ new: true, validateModifiedOnly: true });

            // add this community in this users doc in invited communities array
            userDoc.invitedCommunities.push(communityId);
            await userDoc.save({ new: true, validateModifiedOnly: true });

            // Mark this invitation document status as accepted
            element.status = "Accepted";
            await element.save({ new: true, validateModifiedOnly: true });

            // TODO For every team invitation accepted please send a confirmation mail to user and community super admin

            // Team invitation accepted
          }

          // * DONE At this point we are sure that we have accepted all pending team invitations

          // Get all speaker registrations that are still pending and not cancelled for this users email

          const speakerRegistrations = await Registration.find({
            $and: [
              { type: "Speaker" },
              { status: "Pending" },
              { cancelled: false },
              { userEmail: email },
            ],
          });

          const speakers = await Speaker.find({
            email: email,
          });

          for (let element of speakers) {
            element.userId = user._id;
            await element.save({ new: true, validateModifiedOnly: true });
          }

          // Now we have all speaker registrations for this user which are still pending and not cancelled

          for (let element of speakerRegistrations) {
            // For every registration add it to user registered events and push each registration into user document

            const userDoc = user;

            userDoc.registeredInEvents.push(element.bookedForEventId);
            userDoc.registrations.push(element._id);

            // update each registration as completed and fill details like user Id and other user details that are needed

            element.status = "Completed";
            element.userName = userDoc.firstName + " " + userDoc.lastName;
            element.userImage = userDoc.image;
            element.bookedByUser = userDoc._id;
            element.first_name = userDoc.firstName;
            element.lastName = userDoc.lastName;
            element.name = userDoc.firstName + " " + userDoc.lastName;
            element.organisation = userDoc.organisation;
            element.designation = userDoc.designation;
            element.city = userDoc.city;
            element.country = userDoc.country;

            // Save all updates in userDoc and registration doc.
            await userDoc.save({ new: true, validateModifiedOnly: true });
            await element.save({ new: true, validateModifiedOnly: true });

            // TODO For every speaker invitation accepted please send a confirmation mail to user

            // Speaker invitation accepted
          }

          // * DONE At this point we are sure that we have accepted all pending speaker invitations

          const boothRegistrations = await Registration.find({
            $and: [
              { type: "Exhibitor" },
              { status: "Pending" },
              { cancelled: false },
              { userEmail: email },
            ],
          });

          // Now we have all booth registrations for this user which are still pending and not cancelled

          for (let element of boothRegistrations) {
            // For every registration add it to user registered events and push each registration into user document

            const userDoc = user;

            userDoc.registeredInEvents.push(element.bookedForEventId);
            userDoc.registrations.push(element._id);

            // update each registration as completed and fill details like user Id and other user details that are needed

            element.status = "Completed";
            element.userName = userDoc.firstName + " " + userDoc.lastName;
            element.userImage = userDoc.image;
            element.bookedByUser = userDoc._id;
            element.first_name = userDoc.firstName;
            element.lastName = userDoc.lastName;
            element.name = userDoc.firstName + " " + userDoc.lastName;
            element.organisation = userDoc.organisation;
            element.designation = userDoc.designation;
            element.city = userDoc.city;
            element.country = userDoc.country;

            // Save all updates in userDoc and registration doc.
            await userDoc.save({ new: true, validateModifiedOnly: true });
            await element.save({ new: true, validateModifiedOnly: true });

            // TODO For every booth invitation accepted please send a confirmation mail to user

            // Booth invitation accepted
          }

          // * DONE At this point we are sure that we have accepted all pending booth invitations

          const token = signToken(user._id);

          socket.emit("newGoogleLogin", {
            token,
            data: { user },
          });

          const msg = {
            to: user.email, // Change to your recipient
            from: "shreyanshshah242@gmail.com", // Change to your verified sender
            subject: `Welcome to Bluemeet`,
            text: ` We are glad to have you on Bluemeet. Our customer success team will be in touch with you shortly for helping you discover and unleash power of virtual and hybrid events. In the meantime you can go through these resources to do a self exploration of Bluemeet platform. Cheers!`,
            html: WelcomeToBluemeet(),
          };

          sgMail
            .send(msg)
            .then(async () => {
              console.log("Welcome mail sent successfully!");
            })
            .catch(async (error) => {
              console.log("Failed to send welcome message to our user.");
            });
        }
      } else {
        const user = await new User({
          googleId: googleId,
          email: email,
          firstName: firstName,
          lastName: lastName,
          policySigned: true,
          subscribedToMailList: true,
          image: image,
          referralCode: MyReferralCode,
          signupUsingReferral: 0,
          upgrades: 0,
          credit: 0,
        }).save({ validateModifiedOnly: true });
        const name = `${firstName} ${lastName}`;
        await MailList.create({
          name: name,
          email: email,
        });

        await LoggedInUsers.create({
          userId: user._id,
        });

        const teamInvites = await TeamInvite.find({
          invitedUserEmail: email,
        });

        for (let element of teamInvites) {
          const status = element.status;

          const userEmail = element.invitedUserEmail;

          const communityId = element.communityId;

          const userDoc = user;

          const CommunityDoc = await Community.findById(communityId).populate(
            "eventManagers",
            "email"
          );

          // accept team invitaion

          // Push this persons userId in eventManagers array in community
          CommunityDoc.eventManagers.push(userDoc._id);
          await CommunityDoc.save({ new: true, validateModifiedOnly: true });

          // add this community in this users doc in invited communities array
          userDoc.invitedCommunities.push(communityId);
          await userDoc.save({ new: true, validateModifiedOnly: true });

          // Mark this invitation document status as accepted
          element.status = "Accepted";
          await element.save({ new: true, validateModifiedOnly: true });

          // TODO For every team invitation accepted please send a confirmation mail to user and community super admin

          // Team invitation accepted
        }

        // * DONE At this point we are sure that we have accepted all pending team invitations

        // Get all speaker registrations that are still pending and not cancelled for this users email

        const speakerRegistrations = await Registration.find({
          $and: [
            { type: "Speaker" },
            { status: "Pending" },
            { cancelled: false },
            { userEmail: email },
          ],
        });

        const speakers = await Speaker.find({
          email: email,
        });

        for (let element of speakers) {
          element.userId = user._id;
          await element.save({ new: true, validateModifiedOnly: true });
        }

        // Now we have all speaker registrations for this user which are still pending and not cancelled

        for (let element of speakerRegistrations) {
          // For every registration add it to user registered events and push each registration into user document

          const userDoc = user;

          userDoc.registeredInEvents.push(element.bookedForEventId);
          userDoc.registrations.push(element._id);

          // update each registration as completed and fill details like user Id and other user details that are needed

          element.status = "Completed";
          element.userName = userDoc.firstName + " " + userDoc.lastName;
          element.userImage = userDoc.image;
          element.bookedByUser = userDoc._id;
          element.first_name = userDoc.firstName;
          element.lastName = userDoc.lastName;
          element.name = userDoc.firstName + " " + userDoc.lastName;
          element.organisation = userDoc.organisation;
          element.designation = userDoc.designation;
          element.city = userDoc.city;
          element.country = userDoc.country;

          // Save all updates in userDoc and registration doc.
          await userDoc.save({ new: true, validateModifiedOnly: true });
          await element.save({ new: true, validateModifiedOnly: true });

          // TODO For every speaker invitation accepted please send a confirmation mail to user

          // Speaker invitation accepted
        }

        // * DONE At this point we are sure that we have accepted all pending speaker invitations

        const boothRegistrations = await Registration.find({
          $and: [
            { type: "Exhibitor" },
            { status: "Pending" },
            { cancelled: false },
            { userEmail: email },
          ],
        });

        // Now we have all booth registrations for this user which are still pending and not cancelled

        for (let element of boothRegistrations) {
          // For every registration add it to user registered events and push each registration into user document

          const userDoc = user;

          userDoc.registeredInEvents.push(element.bookedForEventId);
          userDoc.registrations.push(element._id);

          // update each registration as completed and fill details like user Id and other user details that are needed

          element.status = "Completed";
          element.userName = userDoc.firstName + " " + userDoc.lastName;
          element.userImage = userDoc.image;
          element.bookedByUser = userDoc._id;
          element.first_name = userDoc.firstName;
          element.lastName = userDoc.lastName;
          element.name = userDoc.firstName + " " + userDoc.lastName;
          element.organisation = userDoc.organisation;
          element.designation = userDoc.designation;
          element.city = userDoc.city;
          element.country = userDoc.country;

          // Save all updates in userDoc and registration doc.
          await userDoc.save({ new: true, validateModifiedOnly: true });
          await element.save({ new: true, validateModifiedOnly: true });

          // TODO For every booth invitation accepted please send a confirmation mail to user

          // Booth invitation accepted
        }

        // * DONE At this point we are sure that we have accepted all pending booth invitations

        const token = signToken(user._id);

        socket.emit("newGoogleLogin", {
          token,
          data: { user },
        });

        const msg = {
          to: user.email, // Change to your recipient
          from: "shreyanshshah242@gmail.com", // Change to your verified sender
          subject: `Welcome to Bluemeet`,
          text: ` We are glad to have you on Bluemeet. Our customer success team will be in touch with you shortly for helping you discover and unleash power of virtual and hybrid events. In the meantime you can go through these resources to do a self exploration of Bluemeet platform. Cheers!`,
          html: WelcomeToBluemeet(),
        };

        sgMail
          .send(msg)
          .then(async () => {
            console.log("Welcome mail sent successfully!");
          })
          .catch(async (error) => {
            console.log("Failed to send welcome message to our user.");
          });
      }
    }
  });

  socket.on("linkedinSignIn", async ({ result }) => {
    const { linkedinId, firstName, lastName, email, image, referralCode } =
      result;

    const user = await User.findOne({
      email: email,
    });

    if (user) {
      const isUserLoggedInAlready = await LoggedInUsers.find({
        userId: user._id,
      });

      if (isUserLoggedInAlready.length > 0) {
        socket.broadcast.emit("logOutUser", {
          userId: user._id,
          message: "You have been logged In from Other device",
        });
        await LoggedInUsers.findOneAndDelete({
          userId: user.userId,
        });
      }

      await LoggedInUsers.create({
        userId: user._id,
      });

      const token = signToken(user._id);

      socket.emit("newLinkedinLogin", {
        token,
        data: { user },
      });
    } else {
      const MyReferralCode = nanoid(10);
      let referrer;
      if (referralCode) {
        referrer = await User.findOneAndUpdate(
          { referralCode: referralCode },

          { $inc: { signupUsingReferral: 1 } },

          {
            new: true,
            validateModifiedOnly: true,
          }
        );
        if (referrer) {
          const user = await new User({
            linkedinId: linkedinId,
            email: email,
            firstName: firstName,
            lastName: lastName,
            policySigned: true,
            subscribedToMailList: true,
            image: image,
            referralCode: MyReferralCode,
            referrer: referrer._id,
            signupUsingReferral: 0,
            upgrades: 0,
            credit: 0,
          }).save({ validateModifiedOnly: true });

          const name = `${firstName} ${lastName}`;
          await MailList.create({
            name: name,
            email: email,
          });
          await LoggedInUsers.create({
            userId: user._id,
          });

          const teamInvites = await TeamInvite.find({
            invitedUserEmail: email,
          });

          for (let element of teamInvites) {
            const communityId = element.communityId;

            const userDoc = user;

            const CommunityDoc = await Community.findById(communityId).populate(
              "eventManagers",
              "email"
            );

            // accept team invitaion

            // Push this persons userId in eventManagers array in community
            CommunityDoc.eventManagers.push(userDoc._id);
            await CommunityDoc.save({ new: true, validateModifiedOnly: true });

            // add this community in this users doc in invited communities array
            userDoc.invitedCommunities.push(communityId);
            await userDoc.save({ new: true, validateModifiedOnly: true });

            // Mark this invitation document status as accepted
            element.status = "Accepted";
            await element.save({ new: true, validateModifiedOnly: true });

            // TODO For every team invitation accepted please send a confirmation mail to user and community super admin

            // Team invitation accepted
          }

          // * DONE At this point we are sure that we have accepted all pending team invitations

          // Get all speaker registrations that are still pending and not cancelled for this users email

          const speakerRegistrations = await Registration.find({
            $and: [
              { type: "Speaker" },
              { status: "Pending" },
              { cancelled: false },
              { userEmail: email },
            ],
          });

          const speakers = await Speaker.find({
            email: email,
          });

          for (let element of speakers) {
            element.userId = user._id;
            await element.save({ new: true, validateModifiedOnly: true });
          }

          // Now we have all speaker registrations for this user which are still pending and not cancelled

          for (let element of speakerRegistrations) {
            // For every registration add it to user registered events and push each registration into user document

            const userDoc = user;

            userDoc.registeredInEvents.push(element.bookedForEventId);
            userDoc.registrations.push(element._id);

            // update each registration as completed and fill details like user Id and other user details that are needed

            element.status = "Completed";
            element.userName = userDoc.firstName + " " + userDoc.lastName;
            element.userImage = userDoc.image;
            element.bookedByUser = userDoc._id;
            element.first_name = userDoc.firstName;
            element.lastName = userDoc.lastName;
            element.name = userDoc.firstName + " " + userDoc.lastName;
            element.organisation = userDoc.organisation;
            element.designation = userDoc.designation;
            element.city = userDoc.city;
            element.country = userDoc.country;

            // Save all updates in userDoc and registration doc.
            await userDoc.save({ new: true, validateModifiedOnly: true });
            await element.save({ new: true, validateModifiedOnly: true });

            // TODO For every speaker invitation accepted please send a confirmation mail to user

            // Speaker invitation accepted
          }

          // * DONE At this point we are sure that we have accepted all pending speaker invitations

          const boothRegistrations = await Registration.find({
            $and: [
              { type: "Exhibitor" },
              { status: "Pending" },
              { cancelled: false },
              { userEmail: email },
            ],
          });

          // Now we have all booth registrations for this user which are still pending and not cancelled

          for (let element of boothRegistrations) {
            // For every registration add it to user registered events and push each registration into user document

            const userDoc = user;

            userDoc.registeredInEvents.push(element.bookedForEventId);
            userDoc.registrations.push(element._id);

            // update each registration as completed and fill details like user Id and other user details that are needed

            element.status = "Completed";
            element.userName = userDoc.firstName + " " + userDoc.lastName;
            element.userImage = userDoc.image;
            element.bookedByUser = userDoc._id;
            element.first_name = userDoc.firstName;
            element.lastName = userDoc.lastName;
            element.name = userDoc.firstName + " " + userDoc.lastName;
            element.organisation = userDoc.organisation;
            element.designation = userDoc.designation;
            element.city = userDoc.city;
            element.country = userDoc.country;

            // Save all updates in userDoc and registration doc.
            await userDoc.save({ new: true, validateModifiedOnly: true });
            await element.save({ new: true, validateModifiedOnly: true });

            // TODO For every booth invitation accepted please send a confirmation mail to user

            // Booth invitation accepted
          }

          // * DONE At this point we are sure that we have accepted all pending booth invitations

          const token = signToken(user._id);

          socket.emit("newLinkedinLogin", {
            token,
            data: { user },
          });

          const msg = {
            to: user.email, // Change to your recipient
            from: "shreyanshshah242@gmail.com", // Change to your verified sender
            subject: `Welcome to Bluemeet`,
            text: ` We are glad to have you on Bluemeet. Our customer success team will be in touch with you shortly for helping you discover and unleash power of virtual and hybrid events. In the meantime you can go through these resources to do a self exploration of Bluemeet platform. Cheers!`,
            html: WelcomeToBluemeet(),
          };

          sgMail
            .send(msg)
            .then(async () => {
              console.log("Welcome mail sent successfully!");
            })
            .catch(async (error) => {
              console.log("Failed to send welcome message to our user.");
            });
        } else {
          const user = await new User({
            linkedinId: linkedinId,
            email: email,
            firstName: firstName,
            lastName: lastName,
            policySigned: true,
            subscribedToMailList: true,
            image: image,
            referralCode: MyReferralCode,
            signupUsingReferral: 0,
            upgrades: 0,
            credit: 0,
          }).save({ validateModifiedOnly: true });

          const name = `${firstName} ${lastName}`;
          await MailList.create({
            name: name,
            email: email,
          });
          await LoggedInUsers.create({
            userId: user._id,
          });

          const teamInvites = await TeamInvite.find({
            invitedUserEmail: email,
          });

          for (let element of teamInvites) {
            const status = element.status;

            const userEmail = element.invitedUserEmail;

            const communityId = element.communityId;

            const userDoc = user;

            const CommunityDoc = await Community.findById(communityId).populate(
              "eventManagers",
              "email"
            );

            // accept team invitaion

            // Push this persons userId in eventManagers array in community
            CommunityDoc.eventManagers.push(userDoc._id);
            await CommunityDoc.save({ new: true, validateModifiedOnly: true });

            // add this community in this users doc in invited communities array
            userDoc.invitedCommunities.push(communityId);
            await userDoc.save({ new: true, validateModifiedOnly: true });

            // Mark this invitation document status as accepted
            element.status = "Accepted";
            await element.save({ new: true, validateModifiedOnly: true });

            // TODO For every team invitation accepted please send a confirmation mail to user and community super admin

            // Team invitation accepted
          }

          // * DONE At this point we are sure that we have accepted all pending team invitations

          // Get all speaker registrations that are still pending and not cancelled for this users email

          const speakerRegistrations = await Registration.find({
            $and: [
              { type: "Speaker" },
              { status: "Pending" },
              { cancelled: false },
              { userEmail: email },
            ],
          });

          const speakers = await Speaker.find({
            email: email,
          });

          for (let element of speakers) {
            element.userId = user._id;
            await element.save({ new: true, validateModifiedOnly: true });
          }

          // Now we have all speaker registrations for this user which are still pending and not cancelled

          for (let element of speakerRegistrations) {
            // For every registration add it to user registered events and push each registration into user document

            const userDoc = user;

            userDoc.registeredInEvents.push(element.bookedForEventId);
            userDoc.registrations.push(element._id);

            // update each registration as completed and fill details like user Id and other user details that are needed

            element.status = "Completed";
            element.userName = userDoc.firstName + " " + userDoc.lastName;
            element.userImage = userDoc.image;
            element.bookedByUser = userDoc._id;
            element.first_name = userDoc.firstName;
            element.lastName = userDoc.lastName;
            element.name = userDoc.firstName + " " + userDoc.lastName;
            element.organisation = userDoc.organisation;
            element.designation = userDoc.designation;
            element.city = userDoc.city;
            element.country = userDoc.country;

            // Save all updates in userDoc and registration doc.
            await userDoc.save({ new: true, validateModifiedOnly: true });
            await element.save({ new: true, validateModifiedOnly: true });

            // TODO For every speaker invitation accepted please send a confirmation mail to user

            // Speaker invitation accepted
          }

          // * DONE At this point we are sure that we have accepted all pending speaker invitations

          const boothRegistrations = await Registration.find({
            $and: [
              { type: "Exhibitor" },
              { status: "Pending" },
              { cancelled: false },
              { userEmail: email },
            ],
          });

          // Now we have all booth registrations for this user which are still pending and not cancelled

          for (let element of boothRegistrations) {
            // For every registration add it to user registered events and push each registration into user document

            const userDoc = user;

            userDoc.registeredInEvents.push(element.bookedForEventId);
            userDoc.registrations.push(element._id);

            // update each registration as completed and fill details like user Id and other user details that are needed

            element.status = "Completed";
            element.userName = userDoc.firstName + " " + userDoc.lastName;
            element.userImage = userDoc.image;
            element.bookedByUser = userDoc._id;
            element.first_name = userDoc.firstName;
            element.lastName = userDoc.lastName;
            element.name = userDoc.firstName + " " + userDoc.lastName;
            element.organisation = userDoc.organisation;
            element.designation = userDoc.designation;
            element.city = userDoc.city;
            element.country = userDoc.country;

            // Save all updates in userDoc and registration doc.
            await userDoc.save({ new: true, validateModifiedOnly: true });
            await element.save({ new: true, validateModifiedOnly: true });

            // TODO For every booth invitation accepted please send a confirmation mail to user

            // Booth invitation accepted
          }

          // * DONE At this point we are sure that we have accepted all pending booth invitations

          const token = signToken(user._id);

          socket.emit("newLinkedinLogin", {
            token,
            data: { user },
          });

          const msg = {
            to: user.email, // Change to your recipient
            from: "shreyanshshah242@gmail.com", // Change to your verified sender
            subject: `Welcome to Bluemeet`,
            text: ` We are glad to have you on Bluemeet. Our customer success team will be in touch with you shortly for helping you discover and unleash power of virtual and hybrid events. In the meantime you can go through these resources to do a self exploration of Bluemeet platform. Cheers!`,
            html: WelcomeToBluemeet(),
          };

          sgMail
            .send(msg)
            .then(async () => {
              console.log("Welcome mail sent successfully!");
            })
            .catch(async (error) => {
              console.log("Failed to send welcome message to our user.");
            });
        }
      } else {
        const user = await new User({
          linkedinId: linkedinId,
          email: email,
          firstName: firstName,
          lastName: lastName,
          policySigned: true,
          subscribedToMailList: true,
          image: image,
          referralCode: MyReferralCode,
          signupUsingReferral: 0,
          upgrades: 0,
          credit: 0,
        }).save({ validateModifiedOnly: true });

        const name = `${firstName} ${lastName}`;
        await MailList.create({
          name: name,
          email: email,
        });
        await LoggedInUsers.create({
          userId: user._id,
        });

        const teamInvites = await TeamInvite.find({
          invitedUserEmail: email,
        });

        for (let element of teamInvites) {
          const status = element.status;

          const userEmail = element.invitedUserEmail;

          const communityId = element.communityId;

          const userDoc = user;

          const CommunityDoc = await Community.findById(communityId).populate(
            "eventManagers",
            "email"
          );

          // accept team invitaion

          // Push this persons userId in eventManagers array in community
          CommunityDoc.eventManagers.push(userDoc._id);
          await CommunityDoc.save({ new: true, validateModifiedOnly: true });

          // add this community in this users doc in invited communities array
          userDoc.invitedCommunities.push(communityId);
          await userDoc.save({ new: true, validateModifiedOnly: true });

          // Mark this invitation document status as accepted
          element.status = "Accepted";
          await element.save({ new: true, validateModifiedOnly: true });

          // TODO For every team invitation accepted please send a confirmation mail to user and community super admin

          // Team invitation accepted
        }

        // * DONE At this point we are sure that we have accepted all pending team invitations

        // Get all speaker registrations that are still pending and not cancelled for this users email

        const speakerRegistrations = await Registration.find({
          $and: [
            { type: "Speaker" },
            { status: "Pending" },
            { cancelled: false },
            { userEmail: email },
          ],
        });

        const speakers = await Speaker.find({
          email: email,
        });

        for (let element of speakers) {
          element.userId = user._id;
          await element.save({ new: true, validateModifiedOnly: true });
        }

        // Now we have all speaker registrations for this user which are still pending and not cancelled

        for (let element of speakerRegistrations) {
          // For every registration add it to user registered events and push each registration into user document

          const userDoc = user;

          userDoc.registeredInEvents.push(element.bookedForEventId);
          userDoc.registrations.push(element._id);

          // update each registration as completed and fill details like user Id and other user details that are needed

          element.status = "Completed";
          element.userName = userDoc.firstName + " " + userDoc.lastName;
          element.userImage = userDoc.image;
          element.bookedByUser = userDoc._id;
          element.first_name = userDoc.firstName;
          element.lastName = userDoc.lastName;
          element.name = userDoc.firstName + " " + userDoc.lastName;
          element.organisation = userDoc.organisation;
          element.designation = userDoc.designation;
          element.city = userDoc.city;
          element.country = userDoc.country;

          // Save all updates in userDoc and registration doc.
          await userDoc.save({ new: true, validateModifiedOnly: true });
          await element.save({ new: true, validateModifiedOnly: true });

          // TODO For every speaker invitation accepted please send a confirmation mail to user

          // Speaker invitation accepted
        }

        // * DONE At this point we are sure that we have accepted all pending speaker invitations

        const boothRegistrations = await Registration.find({
          $and: [
            { type: "Exhibitor" },
            { status: "Pending" },
            { cancelled: false },
            { userEmail: email },
          ],
        });

        // Now we have all booth registrations for this user which are still pending and not cancelled

        for (let element of boothRegistrations) {
          // For every registration add it to user registered events and push each registration into user document

          const userDoc = user;

          userDoc.registeredInEvents.push(element.bookedForEventId);
          userDoc.registrations.push(element._id);

          // update each registration as completed and fill details like user Id and other user details that are needed

          element.status = "Completed";
          element.userName = userDoc.firstName + " " + userDoc.lastName;
          element.userImage = userDoc.image;
          element.bookedByUser = userDoc._id;
          element.first_name = userDoc.firstName;
          element.lastName = userDoc.lastName;
          element.name = userDoc.firstName + " " + userDoc.lastName;
          element.organisation = userDoc.organisation;
          element.designation = userDoc.designation;
          element.city = userDoc.city;
          element.country = userDoc.country;

          // Save all updates in userDoc and registration doc.
          await userDoc.save({ new: true, validateModifiedOnly: true });
          await element.save({ new: true, validateModifiedOnly: true });

          // TODO For every booth invitation accepted please send a confirmation mail to user

          // Booth invitation accepted
        }

        // * DONE At this point we are sure that we have accepted all pending booth invitations

        const token = signToken(user._id);

        socket.emit("newLinkedinLogin", {
          token,
          data: { user },
        });

        const msg = {
          to: user.email, // Change to your recipient
          from: "shreyanshshah242@gmail.com", // Change to your verified sender
          subject: `Welcome to Bluemeet`,
          text: ` We are glad to have you on Bluemeet. Our customer success team will be in touch with you shortly for helping you discover and unleash power of virtual and hybrid events. In the meantime you can go through these resources to do a self exploration of Bluemeet platform. Cheers!`,
          html: WelcomeToBluemeet(),
        };

        sgMail
          .send(msg)
          .then(async () => {
            console.log("Welcome mail sent successfully!");
          })
          .catch(async (error) => {
            console.log("Failed to send welcome message to our user.");
          });
      }
    }
  });

  socket.on("logOut", async (user) => {
    await LoggedInUsers.findOneAndDelete({
      userId: user.userId,
    });
  });
});

server.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("UNHANDLED REJECTION! Shutting down ...");
  server.close(() => {
    process.exit(1);
  });
});
