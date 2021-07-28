/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

const mongoose = require("mongoose");

const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  // console.log(err.name, err.message);
  console.log(err);
  console.log("UNCAUGHT Exception! Shutting down ...");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3001",

    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],

    credentials: true,
  },
});

const cors = require("cors");
const Event = require("./models/eventModel");
const User = require("./models/userModel");

const lobbyController = require("./controllers/lobbyController");
const UsersInEvent = require("./models/usersInEventModel");
const UsersInSession = require("./models/usersInSessionModel");
const Session = require("./models/sessionModel");

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
    // console.log(con.connections);
    console.log("DB Connection successful");
  });

// console.log(process.env);

const port = process.env.PORT || 8000;

// app.use(cors(
// {

// }

// ));
// app.use(
//   cors({
//      origin: "http://localhost:3001",
//     //origin: "*",
//     methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],

//     credentials: true,
//   })
// );
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
      },
      callback
    ) => {
      socket.join(eventId);

      const fetchCurrentUsers = async () => {
        await Event.findById(eventId, (err, doc) => {
          console.log(doc, "This is events doc from getUsersInRoom");
          io.to(eventId).emit("roomData", { users: doc.currentlyInEvent });
        })
          .select("currentlyInEvent")
          .populate({
            path: "currentlyInEvent",
            options: {
              match: { status: "Active" },
            },
          });
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
        // const existingUser = users.find(
        //   (user) => user.room === room && user.email === email
        // );
        console.log(id, userId, "This is my console log");

        const existingUser = await UsersInEvent.findOne(
          {
            userId: new mongoose.Types.ObjectId(userId),
          },
          async (error, existingUser) => {
            console.log("error", error);

            console.log(existingUser, "existingUser");

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
                  console.log(doc, "line 103");
                  console.log("error: ", err);

                  if (!existingUser) {
                    const eventDoc = await Event.findById(room);
                    eventDoc.currentlyInEvent.push(doc._id);

                    await eventDoc.save(
                      { validateModifiedOnly: true },
                      (err, doc) => {
                        if (err) {
                          console.log(err);
                        } else {
                          fetchCurrentUsers();
                        }
                      }
                    );
                  }
                }
              );
            } else {
              await UsersInEvent.findOneAndUpdate(
                { userId: mongoose.Types.ObjectId(userId) },
                { status: "Active" },
                { new: true },
                (err, doc) => {
                  console.log(err);
                  console.log(doc);
                  fetchCurrentUsers();
                }
              );
            }
          }
        );

        if (!room || !email) return { error: "email and room are required." };
        // if(existingUser) return { error: 'Username is taken.' };

        // return { user };
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
      },
      callback
    ) => {
      console.log("Join session was fired!");

      socket.join(sessionId);

      const fetchCurrentUsersInSession = async () => {
        await Session.findById(sessionId, (err, doc) => {
          console.log(doc, "This is session doc from fetchUserInSession");

          io.to(sessionId).emit("sessionRoomData", {
            sessionUsers: doc.currentlyInSession,
          });

          
        })
          .select("currentlyInSession")
          .populate({
            path: "currentlyInSession",
            options: {
              match: { status: "Active" },
            },
          });
      };

      const fetchCurrentlyOnStage = async () => {
        await Session.findById(sessionId, (err, doc) => {
          console.log(doc, "This is currently on session stage fetchUserInSession");

          io.to(sessionId).emit("stageMembers", {
            stageMembers: doc,
          });

        })
          .select("currentlyOnStage");
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
      }) => {
        const existingUser = await UsersInSession.findOne(
          {
            userId: new mongoose.Types.ObjectId(userId),
          },
          async (error, existingUser) => {
            console.log("error", error);

            console.log(existingUser, "existingUser");

            let mongoUser;

            if (!existingUser) {
              mongoUser = await UsersInSession.create(
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
                },
                async (err, doc) => {
                  console.log(doc, "line 296");
                  console.log("error: ", err);

                  if (!existingUser) {
                    const sessionDoc = await Session.findById(room);
                    sessionDoc.currentlyInSession.push(doc._id);

                    if(sessionRole !== "audience") {
                      sessionDoc.currentlyOnStage = sessionDoc.currentlyOnStage + 1;
                    }

                    await sessionDoc.save(
                      { validateModifiedOnly: true },
                      (err, doc) => {
                        if (err) {
                          console.log(err);
                        } else {
                          fetchCurrentUsersInSession();

                        }
                      }
                    );
                  }
                }
              );
            } else {
              await UsersInSession.findOneAndUpdate(
                { userId: mongoose.Types.ObjectId(userId) },
                { status: "Active" },
                { new: true },
                (err, doc) => {
                  console.log(err);
                  console.log(doc);
                  fetchCurrentUsersInSession();
                  fetchCurrentlyOnStage();
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
      });

      if (error) return callback(error);

      callback();
    }
  );

  // socket.on("addSession", ({ sessionId, sessionStatus, eventId }, callback) => {
  //   console.log(sessionStatus, "addSession");
  //   const { error, session } = addSession({
  //     id: socket.id,
  //     sessionStatus: sessionStatus,
  //     sessionId: sessionId,
  //     room: eventId,
  //   });
  //   // console.log(user);

  //   if (error) return callback(error);

  //   socket.join(session.room);

  //   io.to(session.room).emit("roomSessionData", {
  //     sessions: getSessionsInRoom(session.room),
  //   });

  //   callback();
  // });

  socket.on(
    "setSessionRunningStatus",
    async ({ sessionId, eventId, sessionRunningStatus }, callback) => {
      console.log("sessionId", sessionId);
      console.log("eventId", eventId);
      console.log("sessionRunningStatus", sessionRunningStatus);

      await Session.findByIdAndUpdate(
        sessionId,
        { runningStatus: sessionRunningStatus },
        { new: true },
        (err, doc) => {
          if (err) {
            console.log(err);
          } else {
            console.log(doc, "This is updated session document");

            io.to(eventId).emit("updatedSession", {
              session: doc,
            });

            io.to(sessionId).emit("updatedCurrentSession", {
              session: doc,
            });
          }
        }
      );
      callback();
    }
  );

  socket.on(
    "updateSession",
    ({ sessionId, sessionStatus, eventId }, callback) => {
      const { error, session } = updateSession({
        id: socket.id,
        sessionStatus,
        sessionId: sessionId,
        room: eventId,
      });
      // console.log(user);

      if (error) return callback(error);

      socket.join(session.room);

      io.to(session.room).emit("roomSessionData", {
        sessions: getSessionsInRoom(session.room),
      });

      callback();
    }
  );

  socket.on("disconnectSession", () => {
    const session = removeSession(socket.id);

    if (session) {
      io.to(session.room).emit("roomSessionData", {
        sessions: getSessionsInRoom(session.room),
      });
    }
  });

  socket.on("disconnectUserFromSession", ({ userId, sessionId }) => {
    console.log("Disconnect User From Session was fired!");
    const sessionUser = removeUserFromSession(userId);

    const fetchCurrentUsersInSession = async () => {
      await Session.findById(sessionId, (err, doc) => {
        console.log(doc, "This is session doc from fetchUsersInSession");

        io.to(sessionId).emit("sessionRoomData", {
          sessionUsers: doc.currentlyInSession,
        });

        // TODO Here we also have to send stage members data

        // io.to(sessionUser.room).emit("stageMembers", {
        //   stageMembers: getStageMembers(),
        // });
      })
        .select("currentlyInSession")
        .populate({
          path: "currentlyInSession",
          options: {
            match: { status: "Active" },
          },
        });
    };

    fetchCurrentUsersInSession();

    // io.to(sessionUser.room).emit("sessionRoomData", {
    //   sessionUsers: getUsersInSession(sessionUser.room),
    // });

    // io.to(sessionUser.room).emit("stageMembers", {
    //   stageMembers: getStageMembers(),
    // });
  });

  socket.on("disconnectUser", ({ userId, eventId }) => {
    console.log("Disconnect User was fired!");
    const user = removeUser(userId);

    const fetchCurrentUsers = async () => {
      await Event.findById(eventId, (err, doc) => {
        console.log(doc, "This is events doc from getUsersInRoom");
        io.to(eventId).emit("roomData", { users: doc.currentlyInEvent });
      })
        .select("currentlyInEvent")
        .populate({
          path: "currentlyInEvent",
          options: {
            match: { status: "Active" },
          },
        });
    };

    fetchCurrentUsers();
  });
});

// 4. STARTING THE SERVER
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
