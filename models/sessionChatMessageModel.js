const mongoose = require("mongoose");

const sessionChatMessageSchema = new mongoose.Schema({
  textMessage: {
    type: String,
  },
  sessionId: {
    type: mongoose.Schema.ObjectId,
    ref: "Event",
  },
  visibilityStatus: {
    type: String,
    enum: ["Active", "Removed"],
    default: "Active",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  sessionRole: {
    type: String,
  },
  userName: {
    type: String,
  },
  userEmail: {
    type: String,
  },
  userImage: {
    type: String,
  },
  userId: {
    type: String,
  },
  reported: {
    type: Boolean,
    default: false,
  },
  numOfTimesReported: {
    type: Number,
    default: 0,
  },
});

const SessionChatMessage = mongoose.model(
  "SessionChatMessage",
  sessionChatMessageSchema
);
module.exports = SessionChatMessage;
