const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const LoggedInUsers = require("./models/loggedInUsers");
const MailList = require("./models/emailListModel");
const TableChats = require("./models/tableChatsModel");
const PersonalChat = require("./models/PersonalChatModel");
const ScheduledMeet = require("./models/scheduledMeetModel");
const Registration = require("./models/registrationsModel");
const ConnectionRequest = require("./models/connectionRequestModel");
const NetworkingRoomChats = require("./models/networkingRoomChatsModel");
const SessionPoll = require("./models/sessionPollModel");
const SessionQnA = require("./models/sessionQnAModel");
const { nanoid } = require("nanoid");

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
const {
  removeUser,
  getUsersInSession,
  getStageMembers,
  addSession,
  updateSession,
  removeSession,
  removeUserFromSession,
  getSessionsInRoom,
} = lobbyController;
io.on("connect", (socket) => {
  socket.on("joinNetworking", async ({ room, userId, eventId }, callback) => {
    // Join the room
    socket.join(room); // User has joined the networking room

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
  });

  socket.on("leaveNetworking", async ({ eventId, userId, room }, callback) => {
    // Remove this user from available for networking people in this event

    console.log(eventId, userId);

    console.log("leave networking function was invoked.");

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

  socket.on("subscribeSession", async ({ sessionId }, callback) => {
    socket.join(sessionId);
  });

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
      userId,
      userEmail,
      registrationId,
      sessionId,
      eventId,
      microphone,
      camera,
      screen,
      available,
    }) => {
      console.log(
        userId,
        userEmail,
        registrationId,
        sessionId,
        eventId,
        microphone,
        camera,
        screen,
        available,
        "We have entered into mark me as available on stage function."
      );
      let userRole;
      // Find session and make this user available in people onstage array
      // Then send updated session to all users in this session

      const sessionDoc = await Session.findById(sessionId)
        .populate("host")
        .populate("speaker"); // This is the session doc we need to update

      const hosts = sessionDoc.host; // Hosts for this session
      const speakers = sessionDoc.speaker; // Speakers for this session

      const hostIds = hosts.map((el) => el._id);
      const speakerEmails = speakers.map((el) => el.email);

      if (hostIds.includes(userId)) {
        //This user is a host
        userRole = "Host";
      } else if (speakerEmails.includes(userEmail)) {
        // This user is a speaker
        userRole = "Speaker";
      } else if (
        !hostIds.includes(userId) &&
        !speakerEmails.includes(userEmail)
      ) {
        // This user is an attendee
        userRole = "Attendee";
      }

      const onStagePeople = sessionDoc.onStagePeople;

      // Find if current user exists already using registration Id, userId  comparing with field user

      const existingUser = onStagePeople.find(
        (element) =>
          element.user.toString() === userId.toString() ||
          element.user.toString() === registrationId.toString()
      );

      if (existingUser) {
        // update existing user and save sessionDoc
        existingUser.user = userId;
        existingUser.userRole = userRole;
        existingUser.camera = camera;
        existingUser.microphone = microphone;
        existingUser.screen = screen;
        existingUser.available = available;

        await sessionDoc.save({ new: true, validateModifiedOnly: true });
      } else {
        // Create new user

        let newUserOnStage = {
          user: userId,
          userRole: userRole,
          camera: camera,
          microphone: microphone,
          screen: screen,
          available: available,
        };

        sessionDoc.onStagePeople.push(newUserOnStage);
        await sessionDoc.save({ new: true, validateModifiedOnly: true });
      }

      // Send updated user to everyone in this session

      const session = await Session.findById(sessionId)
        .populate("host")
        .populate("speaker");

      // Also find this users socket and emit the same event to that socket end point

      const { socketId } = await UsersInEvent.findOne({
        $and: [
          { room: mongoose.Types.ObjectId(eventId) },
          { userId: mongoose.Types.ObjectId(userId) },
        ],
      }).select("socketId");

      io.to(socketId).emit("updatedSession", { session: session });

      io.in(sessionId).emit("updatedSession", { session: session });
    }
  );

  socket.on(
    "updateMyMicOnSessionStage",
    async ({ userId, registrationId, sessionId, microphone }, callback) => {
      // Update user camera

      // 1.) Find session doc

      const sessionDoc = await Session.findById(sessionId);

      // 2.) Find and update user on stage

      const thisUserOnStage = sessionDoc.onStagePeople.find(
        (element) =>
          element.user.toString() === userId ||
          element.user.toString() === registrationId
      );

      thisUserOnStage.microphone = microphone;

      // 3.) save session doc

      await sessionDoc.save({ new: true, validateModifiedOnly: true });
      const updatedSession = await Session.findById(sessionId)
        .populate("host")
        .populate("speaker");

      // 4.) Send updated session doc to everyone in this session.

      io.in(sessionId).emit("updatedSession", {
        session: updatedSession,
      });
    }
  );

  socket.on(
    "updateMyCameraOnSessionStage",
    async ({ userId, registrationId, sessionId, camera }, callback) => {
      // Update user mic
      // 1.) Find session doc

      const sessionDoc = await Session.findById(sessionId);

      // 2.) Find and update user on stage

      const thisUserOnStage = sessionDoc.onStagePeople.find(
        (element) =>
          element.user.toString() === userId ||
          element.user.toString() === registrationId
      );

      thisUserOnStage.camera = camera;

      // 3.) save session doc

      await sessionDoc.save({ new: true, validateModifiedOnly: true });
      const updatedSession = await Session.findById(sessionId)
        .populate("host")
        .populate("speaker");

      // 4.) Send updated session doc to everyone in this session.

      io.in(sessionId).emit("updatedSession", {
        session: updatedSession,
      });
    }
  );

  socket.on(
    "updateMyScreenOnSessionStage",
    async (
      { userId, registrationId, sessionId, eventId, screen },
      callback
    ) => {
      // Update user screen share
      // 1.) Find session doc

      const sessionDoc = await Session.findById(sessionId);

      const registrations = await Registration.find({
        bookedForEventId: mongoose.Types.ObjectId(eventId),
      });

      // 2.) Find and update user on stage

      const thisUserOnStage = sessionDoc.onStagePeople.find(
        (element) =>
          element.user.toString() === userId ||
          element.user.toString() === registrationId
      );

      if (thisUserOnStage) {
        thisUserOnStage.screen = screen;

        // 3.) save session doc

        await sessionDoc.save({ new: true, validateModifiedOnly: true });
        const updatedSession = await Session.findById(sessionId)
          .populate("host")
          .populate("speaker");

        // 4.) Send updated session doc to everyone in this session.

        io.in(sessionId).emit("updatedSession", {
          session: updatedSession,
        });

        let people = []; // Collection of {userId, socketId, camera, mic, screen}
        // console.log(sessionDoc.onStagePeople);
        // console.log(registrations);
        for (let element of sessionDoc.onStagePeople) {
          for (let item of registrations) {
            
            if (element.user.toString() === item.bookedByUser.toString()) {
              // Find socketId
              console.log("We reached here");
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
            if (element.user.toString() === item._id.toString()) {
              // Find socketId
              console.log("We reached here in other case");
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
      } else {
        // This user dosen't have a screen track so just let it pass through without doing anything
      }
    }
  );

  socket.on(
    "removeMeFromSessionStage",
    async (
      {
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
      // Mark user as unavailable if he / she is a speaker or host
      // Remove user if he/she is an attendee
      // send updated session doc to everyone in event

      const sessionDoc = await Session.findById(sessionId)
        .populate("host")
        .populate("speaker"); // This is the session doc we need to update

      const hosts = sessionDoc.host; // Hosts for this session
      const speakers = sessionDoc.speaker; // Speakers for this session

      const hostIds = hosts.map((el) => el._id);
      const speakerEmails = speakers.map((el) => el.email);

      if (hostIds.includes(userId)) {
        //This user is a host

        userRole = "Host";
      } else if (speakerEmails.includes(userEmail)) {
        // This user is a speaker

        userRole = "Speaker";
      } else if (
        !hostIds.includes(userId) &&
        !speakerEmails.includes(userEmail)
      ) {
        // This user is an attendee

        userRole = "Attendee";
      }

      const onStagePeople = sessionDoc.onStagePeople;

      const userOnStage = onStagePeople.find(
        (element) =>
          element.user.toString() === userId.toString() ||
          element.user.toString() === registrationId.toString()
      );

      if (userOnStage) {
        if (userRole === "Host" || userRole === "Speaker") {
          // Mark as unavailable and turn off mic, camera, and screen
          userOnStage.user = userId;
          userOnStage.userRole = userRole;
          userOnStage.camera = camera;
          userOnStage.microphone = microphone;
          userOnStage.screen = screen;
          userOnStage.available = available;

          // Save session doc

          await sessionDoc.save({ new: true, validateModifiedOnly: true });

          // Send updated user to everyone in this session

          const session = await Session.findById(sessionId)
            .populate("host")
            .populate("speaker");

          io.in(sessionId).emit("updatedSession", { session: session });

          // Send fully updated session dooc to everyone in this session
        }
        if (userRole === "Attendee") {
          // Remove user from people on stage in this session
          sessionDoc.onStagePeople = sessionDoc.onStagePeople.filter(
            (element) => element.user.toString() !== userId
          );

          // Save session doc

          await sessionDoc.save({ new: true, validateModifiedOnly: true });

          // Send updated user to everyone in this session

          const session = await Session.findById(sessionId)
            .populate("host")
            .populate("speaker");

          io.in(sessionId).emit("updatedSession", { session: session });

          // Send fully updated session dooc to everyone in this session
        }
      }
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

  socket.on("raiseHand", async ({ userId, sessionId, eventId }, callback) => {
    // Add attendee to raised hands ordered queue and send it back to everyone in this session

    const sessionDoc = await Session.findById(sessionId);

    if (!sessionDoc.raisedHands.includes(userId)) {
      sessionDoc.raisedHands.push(userId);
    }

    const updatedSession = await sessionDoc.save({
      new: true,
      validateModifiedOnly: true,
    });

    io.in(sessionId).emit("updatedSession", { updatedSession: updatedSession });
  });

  socket.on("unRaisehand", async ({ userId, sessionId }, callback) => {
    // Remove attendee from raised hands ordered queue and send it back to everyone in this session

    const sessionDoc = await Session.findById(sessionId);

    if (sessionDoc.raisedHands.includes(userId)) {
      sessionDoc.raisedHands = sessionDoc.raisedHands.filter(
        (element) => element.toString() !== userId.toString()
      );
    }

    const updatedSession = await sessionDoc.save({
      new: true,
      validateModifiedOnly: true,
    });

    io.in(sessionId).emit("updatedSession", { updatedSession: updatedSession });
  });

  socket.on("promoteToStage", async ({}, callback) => {
    // Change this attendees role to host and send it back to everyone and attendee who is promoted to stage

    const sessionDoc = await Session.findById(sessionId);

    if (!sessionDoc.attendeeOnStage.includes(userId)) {
      sessionDoc.attendeeOnStage.push(userId);
    }

    const updatedSession = await sessionDoc.save({
      new: true,
      validateModifiedOnly: true,
    });

    // Find attendee socket id and emit event "promotedToStage"

    const UserDoc = await UsersInEvent.findOne({
      $and: [
        { room: mongoose.Types.ObjectId(eventId) },
        { userId: mongoose.Types.ObjectId(userId) },
      ],
    });

    const userSocket = UserDoc.socketId; // ! Socket Id of attendee

    io.to(userSocket).emit("promotedToStage");

    io.in(sessionId).emit("updatedSession", { updatedSession: updatedSession });
  });

  socket.on("removeFromStage", async ({}, callback) => {
    // Change attendees role back to audience and send it back to everyone in session and attendee who is removed from stage

    const sessionDoc = await Session.findById(sessionId);

    if (sessionDoc.attendeeOnStage.includes(userId)) {
      sessionDoc.attendeeOnStage = sessionDoc.attendeeOnStage.filter(
        (element) => element !== userId
      );
    }

    const updatedSession = await sessionDoc.save({
      new: true,
      validateModifiedOnly: true,
    });

    // Find attendee socket id and emit event "promotedToStage"

    const UserDoc = await UsersInEvent.findOne({
      $and: [
        { room: mongoose.Types.ObjectId(eventId) },
        { userId: mongoose.Types.ObjectId(userId) },
      ],
    });

    const userSocket = UserDoc.socketId; // ! Socket Id of attendee

    io.to(userSocket).emit("removeFromStage");

    io.in(sessionId).emit("updatedSession", { updatedSession: updatedSession });
  });

  socket.on("inviteToStage", async ({}, callback) => {
    const sessionDoc = await Session.findById(sessionId);

    if (!sessionDoc.invitedToStage.includes(userId)) {
      sessionDoc.invitedToStage.push(userId);
    }

    const updatedSession = await sessionDoc.save({
      new: true,
      validateModifiedOnly: true,
    });

    // Find attendee socket id and emit event "promotedToStage"

    const UserDoc = await UsersInEvent.findOne({
      $and: [
        { room: mongoose.Types.ObjectId(eventId) },
        { userId: mongoose.Types.ObjectId(userId) },
      ],
    });

    const userSocket = UserDoc.socketId; // ! Socket Id of attendee

    io.to(userSocket).emit("invitedToStage");

    io.in(sessionId).emit("updatedSession", { updatedSession: updatedSession });
  });

  socket.on("acceptStageInvitation", async ({}, callback) => {
    const sessionDoc = await Session.findById(sessionId);

    if (!sessionDoc.attendeeOnStage.includes(userId)) {
      sessionDoc.attendeeOnStage.push(userId);
    }

    if (sessionDoc.invitedToStage.includes(userId)) {
      sessionDoc.invitedToStage = sessionDoc.invitedToStage.filter(
        (element) => element !== userId
      );
    }

    const updatedSession = await sessionDoc.save({
      new: true,
      validateModifiedOnly: true,
    });

    // Find attendee socket id and emit event "promotedToStage"

    const UserDoc = await UsersInEvent.findOne({
      $and: [
        { room: mongoose.Types.ObjectId(eventId) },
        { userId: mongoose.Types.ObjectId(userId) },
      ],
    });

    const userSocket = UserDoc.socketId; // ! Socket Id of attendee

    io.to(userSocket).emit("promotedToStage");

    io.in(sessionId).emit("updatedSession", { updatedSession: updatedSession });
  });

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

  // socket.on(
  //   "confirmMicMuted",
  //   async ({ userId, sessionId, eventId }, callback) => {
  //     // Send confirmation to everyone in this session that requested person's mic has been muted

  //     const sessionDoc = await Session.findById(sessionId);

  //     for (let element of sessionDoc.speakersOnStage) {
  //       if (userId === element.userId) {
  //         element.mic = Disabled;
  //       }
  //     }

  //     // save this session document

  //     const updatedSession = await sessionDoc.save({
  //       new: true,
  //       validateModifiedOnly: true,
  //     });

  //     io.in(sessionId).emit("updatedSession", {
  //       updatedSession: updatedSession,
  //     });
  //   }
  // );

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

  // socket.on("confirmVideoMuted", async ({}, callback) => {
  //   // Send confirmation to everyone in this session that the required person's video has been muted

  //   const sessionDoc = await Session.findById(sessionId);

  //   for (let element of sessionDoc.speakersOnStage) {
  //     if (userId === element.userId) {
  //       element.camera = Disabled;
  //     }
  //   }

  //   // save this session document

  //   const updatedSession = await sessionDoc.save({
  //     new: true,
  //     validateModifiedOnly: true,
  //   });

  //   io.in(sessionId).emit("updatedSession", {
  //     updatedSession: updatedSession,
  //   });
  // });

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

  // socket.on("confirmScreenShareMuted", async ({}, callback) => {
  //   // Send confirmation to everyone in this session that the required person's screen share has been muted

  //   const sessionDoc = await Session.findById(sessionId);

  //   for (let element of sessionDoc.speakersOnStage) {
  //     if (userId === element.userId) {
  //       element.shareScreen = Disabled;
  //     }
  //   }

  //   // save this session document

  //   const updatedSession = await sessionDoc.save({
  //     new: true,
  //     validateModifiedOnly: true,
  //   });

  //   io.in(sessionId).emit("updatedSession", {
  //     updatedSession: updatedSession,
  //   });
  // });

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

  socket.on(
    "playVideoFromURL",
    async ({ sessionId, eventId, videoURL }, callback) => {
      // Send this Link to everyone in this session with its title and description and save it to list of external videos played in this session

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

      io.in(sessionId).emit("playVideoFromURL", {
        videoURL: videoURL,
      });
    }
  );

  socket.on(
    "stopPlayVideoFromURL",
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

      io.in(sessionId).emit("stopPlayVideoFromURL");
    }
  );

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
      .populate("speaker");

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

    const attendeesOnStage = sessionDoc.onStagePeople.filter(
      (element) => element.userRole === "Attendee"
    ); // These are all attendees that were present on stage

    // Send notification to each one of them

    for (let element of attendeesOnStage) {
      // Find socket id for this user(element)

      const { socketId } = await UsersInSession.findOne({
        $and: [
          { room: mongoose.Types.ObjectId(sessionId) },
          { userId: mongoose.Types.ObjectId(element.user) },
        ],
      }).select("socketId");

      io.to(socketId).emit("removedFromStageAsSessionPaused");
    }

    sessionDoc.onStagePeople = sessionDoc.onStagePeople.filter(
      (element) => element.userRole !== "Attendee"
    ); // Now we are left with only host and speakers on stage

    await sessionDoc.save({
      new: true,
      validateModifiedOnly: true,
    });

    const updatedSession = await Session.findById(sessionId)
      .populate("host")
      .populate("speaker");

    console.log(updatedSession.onStagePeople);

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
      .populate("speaker");

    io.in(sessionId).emit("sessionResumed", {
      session: updatedSession,
    });
  });

  socket.on("endSession", async ({ sessionId }, callback) => {
    // Send end this session event to everyone in this session and show appropriate screens

    const sessionDoc = await Session.findById(sessionId);

    sessionDoc.runningStatus = "Ended";

    // While pausing session please remove any attendee who is still on stage and send that user a notification
    // Please remember that their can be multiple attendees on stage at this time

    const attendeesOnStage = sessionDoc.onStagePeople.filter(
      (element) => element.userRole === "Attendee"
    ); // These are all attendees that were present on stage

    // Send notification to each one of them

    for (let element of attendeesOnStage) {
      // Find socket id for this user(element)

      const { socketId } = await UsersInSession.findOne({
        $and: [
          { room: mongoose.Types.ObjectId(sessionId) },
          { userId: mongoose.Types.ObjectId(element.user) },
        ],
      }).select("socketId");

      io.to(socketId).emit("removedFromStageAsSessionEnded");
    }

    sessionDoc.onStagePeople = sessionDoc.onStagePeople.filter(
      (element) => element.userRole !== "Attendee"
    ); // Now we are left with only host and speakers on stage

    await sessionDoc.save({
      new: true,
      validateModifiedOnly: true,
    });

    const updatedSession = await Session.findById(sessionId)
      .populate("host")
      .populate("speaker");

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

  socket.on("leaveChair", ({ chairId, eventId, tableId }, callback) => {
    fetchCurrentRoomChairs = async () => {
      await Event.findById(eventId, (err, doc) => {
        if (err) {
          console.log(err);
        } else {
          io.to(eventId).emit("roomChairData", { roomChairs: doc.chairs });
        }
      })
        .select("chairs")
        .populate("chairs");
    };

    fetchNumberOfPeopleOnTable = async () => {
      await RoomTable.findOne({ tableId: tableId }, (err, tableDoc) => {
        if (err) {
        } else {
          io.to(tableId).emit("numberOfPeopleOnTable", {
            numberOfPeopleOnTable: tableDoc.numberOfPeople,
          });
        }
      });
    };

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

                      fetchNumberOfPeopleOnTable(); // ! Listen To This event

                      socket.leave(tableId);
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

    if (error) return callback(error);

    callback();
  });

  socket.on(
    "updateChair",
    (
      {
        eventId,
        tableId,
        chairId,
        userId,
        userRole,
        userName,
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

      fetchCurrentRoomChairs = async () => {
        await Event.findById(eventId, (err, doc) => {
          if (err) {
            console.log(err);
          } else {
            io.to(eventId).emit("roomChairData", { roomChairs: doc.chairs });
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
            io.to(tableId).emit("numberOfPeopleOnTable", {
              numberOfPeopleOnTable: tableDoc.numberOfPeople,
            });
          }
        });
      };

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
                        async (err, table) => {
                          if (err) {
                            console.log(err);
                          } else {
                            if (!table) {
                              // handle if table does not exists

                              await RoomTable.create(
                                {
                                  eventId: eventId,
                                  tableId: tableId,
                                  numberOfPeople: 1,
                                },
                                async (err, newTable) => {
                                  if (err) {
                                    console.log(err);
                                  } else {
                                    fetchNumberOfPeopleOnTable();
                                    await Event.findById(
                                      eventId,
                                      (err, event) => {
                                        if (err) {
                                          console.log(err);
                                        } else {
                                          event.tables.push(newTable._id);
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            } else {
                              // handle if table already exists

                              await RoomTable.findOne(
                                { tableId: tableId },
                                (err, tableDoc) => {
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
                                          // TODO call fetchNumberOfPeopleOnTable
                                          fetchNumberOfPeopleOnTable();
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            }
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
                            // TODO call fetchNumberOfPeopleOnTable
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

      if (error) return callback(error);

      callback();
    }
  );

  socket.on(
    "join",
    (
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
    (
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

      const fetchCurrentUsersInSession = async (sessionId) => {
        await UsersInSession.find(
          { room: mongoose.Types.ObjectId(sessionId) },
          (err, doc) => {
            io.to(sessionId).emit("usersInSession", {
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

      if (error) return callback(error);
      callback();
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
              session: doc,
            });

            // transmit to people currently in session
            io.to(sessionId).emit("updatedCurrentSession", {
              session: doc,
            });
          }
        }
      );
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

  socket.on(
    "transmitEventAlert",
    async ({
      alertMsg,
      eventId,
      hostId,
      hostEmail,
      hostFirstName,
      hostLastName,
      hostImage,
      organisation,
      designation,
    }) => {
      await EventAlert.create(
        {
          alertMsg,
          eventId,
          hostId,
          hostEmail,
          hostFirstName,
          hostLastName,
          hostImage,
          organisation,
          designation,
        },
        async (err, eventAlertDoc) => {
          if (err) {
            console.log(err);
          } else {
            await Event.findById(eventId, async (err, eventDoc) => {
              if (err) {
                console.log(err);
              } else {
                eventDoc.alerts.push(eventAlertDoc._id);

                eventDoc.save({ validateModifiedOnly: true }, (err, data) => {
                  if (err) {
                    console.log(err);
                  } else {
                    io.in(eventId).emit("newEventAlert", {
                      newAlert: eventAlertDoc,
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

  socket.on("disconnectUser", ({ userId, eventId }) => {
    const user = removeUser(userId, eventId);

    const fetchCurrentUsers = async (eventId) => {
      await Event.findById(eventId, (err, doc) => {
        if (err) {
          console.log(err);
        } else {
          io.to(eventId).emit("roomData", { users: doc.currentlyInEvent });
        }
      })
        .select("currentlyInEvent")
        .populate({
          path: "currentlyInEvent",
          options: {
            match: { status: "Active" },
          },
        });
    };

    fetchCurrentUsers(eventId);
    // socket.leave(eventId);
  });

  socket.on("loggingInUser", async ({ email, password }) => {
    if (!email || !password) {
      return;
    }

    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
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

  socket.on(
    "googleSignIn",

    async ({ ModifiedFormValues }) => {
      const { googleId, firstName, lastName, image, email, referralCode } =
        ModifiedFormValues;
      const user = await User.findOne({ googleId: googleId });
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
              subscribedToMailList: true,
              image: image,
              referrer: referrer._id,
            }).save({ validateModifiedOnly: true });
            const name = `${firstName} ${lastName}`;
            await MailList.create({
              name: name,
              email: email,
            });
            await LoggedInUsers.create({
              userId: user._id,
            });

            const token = signToken(user._id);

            socket.emit("newGoogleLogin", {
              token,
              data: { user },
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
          }).save({ validateModifiedOnly: true });
          const name = `${firstName} ${lastName}`;
          await MailList.create({
            name: name,
            email: email,
          });
          await LoggedInUsers.create({
            userId: user._id,
          });

          const token = signToken(user._id);

          socket.emit("newGoogleLogin", {
            token,
            data: { user },
          });
        }
      }
    }
  );

  socket.on("linkedinSignIn", async ({ result }) => {
    const { linkedinId, firstName, lastName, email, image, referralCode } =
      result;

    const user = await User.findOne({
      linkedinId: linkedinId,
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
      //  we already have a record with the givenuserProfile ID
      //done(null, existingUser);

      // createSendToken(existingUser, 200, req, res);
    } else {
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
            referrer: referrer._id,
          }).save({ validateModifiedOnly: true });

          const name = `${firstName} ${lastName}`;
          await MailList.create({
            name: name,
            email: email,
          });
          await LoggedInUsers.create({
            userId: user._id,
          });

          const token = signToken(user._id);

          socket.emit("newLinkedinLogin", {
            token,
            data: { user },
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
          }).save({ validateModifiedOnly: true });

          const name = `${firstName} ${lastName}`;
          await MailList.create({
            name: name,
            email: email,
          });
          await LoggedInUsers.create({
            userId: user._id,
          });

          const token = signToken(user._id);

          socket.emit("newLinkedinLogin", {
            token,
            data: { user },
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
        }).save({ validateModifiedOnly: true });

        const name = `${firstName} ${lastName}`;
        await MailList.create({
          name: name,
          email: email,
        });
        await LoggedInUsers.create({
          userId: user._id,
        });

        const token = signToken(user._id);

        socket.emit("newLinkedinLogin", {
          token,
          data: { user },
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
