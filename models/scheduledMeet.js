// Reciver consent
const mongoose = require("mongoose");

const scheduledMeetSchema = new mongoose.Schema({
  meetId: {
    type: String, // randomly generated unique number string
    // This will be used as agora channel number
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  participants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User", // Participants other than the creator itself
    },
  ],
  startsAt: {
    type: Date,
  },
  endsAt: {
    type: Date,
  },
  title: {
    type: String,
  },
  shortDescription: {
    type: String,
  },
  allowOthersToInvite: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const ScheduledMeet = mongoose.model("ScheduledMeet", scheduledMeetSchema);
module.exports = ScheduledMeet;
