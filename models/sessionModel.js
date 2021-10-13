const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Session", "Stream"],
    },
    whoCanJoin: {
      type: String,
      enum: ["Everyone", "ticketHolders", "people"],
    },
    permittedTickets: [
      {
        type: String, // ids of tickets that will be allowed entry into this event.
      },
    ],
    permittedPeople: [
      {
        type: String, // ids of people who will be able to join this session
      },
    ],
    RTMPstreamKey: {
      type: String,
    },
    RTMPstreamURL: {
      type: String,
    },
    RTMPPlaybackId: {
      type: String,
    },
    RTMPCredentialsId: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    eventId: {
      type: mongoose.Schema.ObjectId,
      ref: "Event",
    },
    name: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Deleted"],
      default: "Active",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
      default: Date.now(), //todo
    },
    duration: {
      type: Number,
    },
    host: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    speaker: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Speaker",
      },
    ],
    agenda: {
      type: String,
    },
    summary: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    description: {
      type: String,
      default:
        "From combatting Email Fraud to Building Your Brand! Research: Stories about brands being phished, loss of trust due to phishing, Success stories due to DMARC",
    },
    currentlyInSession: [
      { type: mongoose.Schema.ObjectId, ref: "UsersInSession" },
    ],
    runningStatus: {
      type: String,
      default: "Not Yet Started",
      enum: ["Not Yet Started", "Started", "Paused", "Ended", "Resumed"],
    },
    currentlyOnStage: {
      type: Number,
      default: 0,
    },
    sessionStatus: {
      type: String,
    },
    chatMessages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SessionChatMessage",
      },
    ],
    resourceId: {
      type: String,
    },
    sid: {
      type: String,
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

sessionSchema.index({ name: "text", description: "text" });

sessionSchema.pre(/^find/, function (next) {
  this.find({ status: { $ne: "Deleted" } });
  next();
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
