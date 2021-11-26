const mongoose = require("mongoose");

const eventAlertSchema = new mongoose.Schema({
  alertMsg: {
    type: String,
  },
  eventId: {
    type: mongoose.Schema.ObjectId,
    ref: "Event",
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const EventAlert = mongoose.model("EventAlert", eventAlertSchema);
module.exports = EventAlert;
