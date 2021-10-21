const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const LoggedInUsers = require("./models/loggedInUsers");
const MailList = require("./models/emailListModel");
const TableChats = require("./models/tableChatsModel");
const PersonalChat = require("./models/PersonalChatModel");

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
  socket.on("joinNetworking", async ({ eventId, userId }, callback) => {
    await Event.findById(eventId, async (err, eventDoc) => {
      if (err) {
        console.log(err);
      } else {
        eventDoc.currentlyInNetworking.push(userId);

        eventDoc.save(
          { validateModifiedOnly: true },
          async (err, updatedDoc) => {
            if (err) {
              console.log("There was an error while updating event document.");
            } else {
              console.log("Event doc updated successfully.");
            }
          }
        );
      }
    });
    callback();
  });

  socket.on("leaveNetworking", async ({ eventId, userId }, callback) => {
    await Event.findById(eventId, async (err, eventDoc) => {
      if (err) {
        console.log(err);
      } else {
        eventDoc.currentlyInNetworking;

        const index = eventDoc.currentlyInNetworking.indexOf(userId);
        if (index > -1) {
          eventDoc.currentlyInNetworking.splice(index, 1);
        }

        eventDoc.save(
          { validateModifiedOnly: true },
          async (err, updatedDoc) => {
            if (err) {
              console.log("There was an error while updating event document.");
            } else {
              console.log(
                "User Successfully left networking zone. Event doc updated successfully."
              );
            }
          }
        );
      }
    });
    callback();
  });

  socket.on(
    "startNetworking",
    async ({ eventId, userId, userName, image, socketId }, callback) => {
      const sendAllAvailableForNetworking = async ({ eventId, socketId }) => {
        const availableInThisEvent = await AvailableForNetworking.find({
          $and: [{ eventId: eventId }, { status: "Available" }],
        });

        io.in(eventId).emit("listOfAvailablePeopleInNetworking", {
          availableForNetworking: availableInThisEvent,
        });
      };

      await AvailableForNetworking.findOne(
        { $and: [{ eventId: eventId }, { userId: userId }] },
        async (err, doc) => {
          if (err) {
            console.log(err);
          } else {
            console.log(doc);
            if (doc) {
              // Already existing
              doc.status = "Available";
              doc.socketId = socketId;

              doc.save({ validateModifiedOnly: true }, (err, updatedDoc) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log("Updated status to available.");

                  // Send list of all available participants at this time in this event

                  sendAllAvailableForNetworking(eventId, socketId);
                }
              });
            } else {
              // Not Existing before, create new document
              await AvailableForNetworking.create(
                {
                  userId: userId,
                  userName: userName,
                  image: image,
                  eventId: eventId,
                  socketId: socketId,
                  status: "Available",
                },
                async (err, newAvailableUser) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("created new available user");

                    // Send list of all available participants at this time in this event
                    sendAllAvailableForNetworking(eventId, socketId);
                  }
                }
              );
            }
          }
        }
      );
      // callback();
    }
  );

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
                sessionDoc.chatMessages.push(chatMsgDoc._id);

                sessionDoc.save({ validateModifiedOnly: true }, (err, data) => {
                  if (err) {
                    console.log(err);
                  } else {
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
        console.log(
          "This is a flag for fetching pervious messages of this event"
        );
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
              console.log("This is an existing user.");
              await UsersInEvent.findOneAndUpdate(
                {
                  $and: [
                    { userId: mongoose.Types.ObjectId(userId) },
                    { room: mongoose.Types.ObjectId(eventId) },
                  ],
                },
                { status: "Active", socketId: id }, // Mark as active and update socket Id
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
                  roleToBeDisplayed: roleToBeDisplayed,
                },
                async (err, doc) => {
                  if (err) {
                    console.log(err);
                  }
                  const sessionDoc = await Session.findById(room);
                  sessionDoc.currentlyInSession.push(doc._id);

                  await sessionDoc.save(
                    { validateModifiedOnly: true },
                    (err, doc) => {
                      if (err) {
                        console.log(err);
                      } else {
                        fetchCurrentUsersInSession(sessionId);
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

      const recieverSoket = RecieverDoc.socketId; // ! Socket Id of reciver

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

      io.to(recieverSoket).emit("newPersonalMessage", {
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
