const mongoose = require("mongoose");

const pollOptionSchema = new mongoose.Schema({
  option: {
    type: String,
  },
  numberOfVotes: {
    type: Number,
    default: 0,
  },
  votedBy: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
});

const sessionPollSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Single select", "Multi select"],
    default: "Single select",
  },
  whoCanSeeAnswers: {
    type: String,
    enum: ["Host only", "Host and speakers", "Everyone"],
    default: "Everyone",
  },
  question: {
    type: String,
  },
  options: [pollOptionSchema],
  expiresAt: {
    type: Number,
  },
  eventId: {
    type: mongoose.Schema.ObjectId,
    ref: "Event",
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  sessionId: {
    type: mongoose.Schema.ObjectId,
    ref: "Session",
  },

  votedBy: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  deleted: {
    type: Boolean,
    default: false,
  },
  showOnStage: {
    type: Boolean,
    default: false,
  },
});

const SessionPoll = mongoose.model("SessionPoll", sessionPollSchema);
module.exports = SessionPoll;
