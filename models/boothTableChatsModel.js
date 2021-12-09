const mongoose = require("mongoose");

const boothTableChatsSchema = new mongoose.Schema({
  textMessage: {
    type: String,
  },
  isReply: {
    type: Boolean,
  },
  replyTo: {
    type: mongoose.Schema.ObjectId,
    ref: "BoothTableChats",
  },
  eventId: {
    type: mongoose.Schema.ObjectId,
    ref: "Event",
  },
  tableId: {
    type: String,
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
  numOfTimesReported: {
    type: Number,
    default: 0,
  },
  reportReason: {
    type: String,
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

const BoothTableChats = mongoose.model(
  "BoothTableChats",
  boothTableChatsSchema
);
module.exports = BoothTableChats;
