const mongoose = require("mongoose");

const eventChatMessageSchema = new mongoose.Schema({
  textMessage: {
    type: String,
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

const EventChatMessage = mongoose.model("EventChatMessage", eventChatMessageSchema);
module.exports = EventChatMessage;
