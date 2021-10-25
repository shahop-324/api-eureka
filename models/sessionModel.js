const mongoose = require("mongoose");

const onStagePeopleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  email: {
    type: String,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  camera: {
    type: Boolean,
    default: false,
  },
  microphone: {
    type: Boolean,
    default: false,
  },
  screen: {
    type: Boolean,
    default: false,
  },
  available: {
    type: Boolean,
    default: false,
  },
});

const sessionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Session", "Stream"],
    },
    previewImage: {
      type: String,
      default: "pexels-david-yu-2684383.jpg",
    },
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
    },

    onStagePeople: [onStagePeopleSchema],
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
