const mongoose = require("mongoose");

const eventChatMessageSchema = new mongoose.Schema({
  textMessage: {
    type: String,
  },
  isReply: {
    type: Boolean,
  },
  replyTo: {
    type: mongoose.Schema.ObjectId,
    ref: "EventChatMessage",
  },
  eventId: {
    type: mongoose.Schema.ObjectId,
    ref: "Event",
  },
  visibilityStatus: {
    type: String,
    enum: ["Active", "Removed"],
    default: "Active",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  suspended: {
    type: Boolean,
    default: false,
  },
  warned: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  userRole: {
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
  userOrganisation: {
    type: String,
  },
  userDesignation: {
    type: String,
  },
  userId: {
    type: String,
  },
  reported: {
    type: Boolean,
    default: false,
  },
  reportReason: {
    type: String,
  },
  numOfTimesReported: {
    type: Number,
    default: 0,
  },
  reportedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  seenBy: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
});

const EventChatMessage = mongoose.model(
  "EventChatMessage",
  eventChatMessageSchema
);
module.exports = EventChatMessage;
