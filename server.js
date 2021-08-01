/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

const mongoose = require("mongoose");

const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
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
const RoomChair = require("./models/roomChairModel");
const RoomTable = require("./models/roomTableModel");
const EventChatMessage = require("./models/eventChatMessageModel");

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
        userName,
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
                    userName: userName,
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
                existingChair.userName = userName;
                existingChair.userEmail = userEmail;
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
        userEmail: userEmail,
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
      },
      callback
    ) => {
      socket.join(eventId);

      const fetchCurrentMessages = async (eventId) => {
        await Event.findById(eventId, (err, doc) => {
          if (err) {
            console.log(err);
          } else {
            io.to(eventId).emit("previousEventMessages", {
              chats: doc.chatMessages,
            });
          }
        })
          .select("chatMessages")
          .populate("chatMessages");
      };

      fetchCurrentMessages(eventId);

      const fetchCurrentUsers = async (eventId) => {
        await Event.findById(eventId, (err, doc) => {
          console.log(doc.currentlyInEvent);
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
                    const eventDoc = await Event.findById(room);
                    eventDoc.currentlyInEvent.push(doc._id);

                    await eventDoc.save(
                      { validateModifiedOnly: true },
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
            } else {
              await UsersInEvent.findOneAndUpdate(
                {
                  $and: [
                    { userId: mongoose.Types.ObjectId(userId) },
                    { room: mongoose.Types.ObjectId(eventId) },
                  ],
                },
                { status: "Active" },
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
      },
      callback
    ) => {
      socket.join(sessionId);

      const fetchCurrentUsersInSession = async (sessionId) => {
        await Session.findById(sessionId, (err, doc) => {
          if (err) {
            console.log(err);
          } else {
            io.to(sessionId).emit("sessionRoomData", {
              sessionUsers: doc.currentlyInSession,
            });
          }
        })
          .select("currentlyInSession")
          .populate({
            path: "currentlyInSession",
            options: {
              match: { status: "Active" },
            },
          });
      };

      const fetchCurrentlyOnStage = async (sessionId) => {
        await Session.findById(sessionId, (err, doc) => {
          if (err) {
            console.log(err);
          } else {
            io.to(sessionId).emit("stageMembers", {
              stageMembers: doc,
            });
          }
        }).select("currentlyOnStage");
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
            $and: [
              { userId: new mongoose.Types.ObjectId(userId) },
              { room: new mongoose.Types.ObjectId(room) },
            ],
          },
          async (err, existingUser) => {
            if (err) {
              console.log(err);
            }
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
                  if (err) {
                    console.log(err);
                  }
                  const sessionDoc = await Session.findById(room);
                  sessionDoc.currentlyInSession.push(doc._id);

                  if (sessionRole !== "audience") {
                    sessionDoc.currentlyOnStage =
                      sessionDoc.currentlyOnStage + 1;
                  }
                  await sessionDoc.save(
                    { validateModifiedOnly: true },
                    (err, doc) => {
                      if (err) {
                        console.log(err);
                      } else {
                        fetchCurrentUsersInSession(sessionId);
                        fetchCurrentlyOnStage(sessionId);
                      }
                    }
                  );
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
                { status: "Active" },
                { new: true },
                (err, doc) => {
                  if (err) {
                    console.log(err);
                  } else {
                    fetchCurrentUsersInSession(sessionId);
                    fetchCurrentlyOnStage(sessionId);
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

  socket.on(
    "transmitEventMessage",
    async ({
      textMessage,
      eventId,
      createdAt,
      userRole,
      userName,
      userEmail,
      userImage,
      userId,
      reported,
      numOfTimesReported,
      visibilityStatus,
    }) => {
      await EventChatMessage.create(
        {
          textMessage,
          eventId,
          createdAt,
          userRole,
          userName,
          userEmail,
          userImage,
          userId,
          reported,
          numOfTimesReported,
          visibilityStatus,
        },
        async (err, chatMsgDoc) => {
          if (err) {
            console.log(err);
          } else {
            await Event.findById(eventId, async (err, eventDoc) => {
              if (err) {
                console.log(err);
              } else {
                console.log(eventDoc);
                eventDoc.chatMessages.push(chatMsgDoc._id);

                eventDoc.save({ validateModifiedOnly: true }, (err, data) => {
                  if (err) {
                    console.log(err);
                  } else {
                    io.to(eventId).emit("newEventMsg", {
                      newMsg: chatMsgDoc,
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

  socket.on("disconnectUserFromSession", ({ userId, sessionId }) => {
    const sessionUser = removeUserFromSession(userId, sessionId);

    const fetchCurrentUsersInSession = async (sessionId) => {
      await Session.findById(sessionId, (err, doc) => {
        if (err) {
          console.log(err);
        } else {
          io.to(sessionId).emit("sessionRoomData", {
            sessionUsers: doc.currentlyInSession,
          });
        }
        // TODO Here we also have to send stage members data
      })
        .select("currentlyInSession")
        .populate({
          path: "currentlyInSession",
          options: {
            match: { status: "Active" },
          },
        });
    };

    fetchCurrentUsersInSession(sessionId);
    // socket.leave(sessionId);
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
