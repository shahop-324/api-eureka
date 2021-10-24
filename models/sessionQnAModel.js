const mongoose = require("mongoose");
const validator = require("validator");

const sessionQnASchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.ObjectId,
      ref: "Registration",
    },
    answer: {
      type: String,
      enum: ["Active", "Inactive", "Deleted"],
      default: "Active",
    },
    showOnStage: {
      type: Boolean,
      default: false,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: [
      {
        type: String, // user ids of users who have upvoted this question
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    askedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    answeredBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    sessionId: {
      type: mongoose.Schema.ObjectId,
      ref: "Session",
    },
    eventId: {
      type: mongoose.Schema.ObjectId,
      ref: "Event",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const SessionQnA = mongoose.model("SessionQnA", sessionQnASchema);

module.exports = SessionQnA;
