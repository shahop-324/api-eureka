const mongoose = require("mongoose");

const onLiveStagePeopleSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.ObjectId,
      ref: "Session",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    userRole: {
      type: String,
      enum: ["organiser", "speaker", "attendee", "exhibitor"], // Can be Host Speaker or Attendee
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const OnLiveStagePeople = mongoose.model(
  "OnLiveStagePeople",
  onLiveStagePeopleSchema
);
module.exports = OnLiveStagePeople;
