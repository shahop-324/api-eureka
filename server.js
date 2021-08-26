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
const cors = require("cors");
const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:3001",
      "https://www.evenz.in",
      "https://evenz.in",
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
const EventAlert = require("./models/eventAlertsModel");
const EventPoll = require("./models/eventPollModel");

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
  // socket.on(
  //   "transmitSessionMessage", () => {
  //     console.log("This is transmit session message")
  //   }

  // );

  socket.on(
    "transmitSessionMessage",
    async ({
      textMessage,
      sessionId,
      createdAt,
      sessionRole,
      userName,
      userEmail,
      userImage,
      userId,
      reported,
      numOfTimesReported,
      visibilityStatus,
    }) => {
      console.log("I Reached in transmit session message.");
      await SessionChatMessage.create(
        {
          textMessage,
          sessionId,
          createdAt,
          sessionRole,
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
            await Session.findById(sessionId, async (err, sessionDoc) => {
              if (err) {
                console.log(err);
              } else {
                console.log(sessionDoc);
                sessionDoc.chatMessages.push(chatMsgDoc._id);

                sessionDoc.save({ validateModifiedOnly: true }, (err, data) => {
                  if (err) {
                    console.log(err);
                  } else {
                    // io.to(sessionId).emit("newSessionMsg", {
                    //   newMsg: chatMsgDoc,
                    // });

                    io.in(sessionId).emit("newSessionMsg", {
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
        userRole,
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
          if (err) {
            console.log(err);
          } else {
            console.log(doc.currentlyInEvent);
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
      console.log(`I joined session with id ${sessionId}`);

      const fetchCurrentMessages = async (sessionId) => {
        await Session.findById(sessionId, (err, doc) => {
          if (err) {
            console.log(err);
          } else {
            io.to(sessionId).emit("previousSessionMessages", {
              chats: doc.chatMessages,
            });
          }
        })
          .select("chatMessages")
          .populate("chatMessages");
      };

      fetchCurrentMessages(sessionId);

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

  socket.on("updatePoll", async ({ userId, selectedPoll, selectedOption }) => {
    console.log("I am in update polls section.");
    console.log("User Id: ", userId);
    console.log("selected Poll Id: ", selectedPoll);
    console.log("Selected poll option: ", selectedOption);

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
      console.log("I reached in event poll section.");
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
      console.log("I reached in event alert section.");
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
                console.log(eventDoc);
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
      console.log("I reached in event alert section.");
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
                    io.in(eventId).emit("newEventMsg", {
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
