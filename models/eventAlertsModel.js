const mongoose = require("mongoose");

const eventAlertSchema = new mongoose.Schema({
  alertMsg: {
    type: String,
  },
  eventId: {
    type: mongoose.Schema.ObjectId,
    ref: "Event",
  },
  hostId: {
    type: String,
  },
  hostFirstName: {
    type: String,
  },
  hostLastName: {
    type: String,
  },
  hostEmail: {
    type: String,
  },
  hostImage: {
      type: String,
  },
  organisation: {
    type: String,
  },
  designation: {
    type: String,
  },
});

const EventAlert = mongoose.model("EventAlert", eventAlertSchema);
module.exports = EventAlert;
