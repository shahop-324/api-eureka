const mongoose = require("mongoose");

const onStagePeopleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    userRole: {
      type: String,
      enum: ["organiser", "speaker", "attendee", "exhibitor"], // Can be a Host, Speaker or Attendee
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
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const raisedHandsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },
    userName: { type: String },
    userImage: { type: String },
    userEmail: { type: String },
    userOrganisation: { type: String },
    userDesignation: { type: String },
    isOnStage: {
      type: Boolean,
      default: false,
    },
    raisedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const sessionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Session", "Stream"],
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
      default: "In Progress",
      enum: ["In Progress", "Ended"],
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
    raisedHands: [raisedHandsSchema],
    streamingLive: {
      type: Boolean,
      default: false,
    },
    tracks: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Track",
      },
    ],
    people: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    recording: {
      type: Boolean,
      default: false,
    },
    video: {
      type: String,
    },
    replay: {
      type: Boolean,
      default: false,
    },
    preview: {
      // This is the session preview image
      type: String,
      default: "pexels-david-yu-2684383.jpg",
    },
    allowEntryBeforeSessionBegin: {
      type: Boolean,
      default: false,
    },
    liveChat: {
      type: Boolean,
      default: true,
    },
    peopleInSession: {
      type: Boolean,
      default: true,
    },
    raiseHand: {
      type: Boolean,
      default: true,
    },
    qna: {
      type: Boolean,
      default: true,
    },
    polls: {
      type: Boolean,
      default: true,
    },
    videos: {
      type: Boolean,
      default: true,
    },
    attendeeCount: {
      type: Boolean,
      default: true,
    },
    emojiReactions: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      default: "#152d35",
    },
    vibe: {
      type: String,
    },
    attendedBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

sessionSchema.index({ name: "text", description: "text" });

sessionSchema.pre(/^find/, function (next) {
  this.find({ status: { $ne: "Deleted" } })
    .populate(
      "people",
      "firstName lastName image city country organisation designation"
    )
    .populate("host")
    .populate("speaker");
  next();
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
