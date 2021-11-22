const mongoose = require("mongoose");

const onBackStagePeopleSchema = new mongoose.Schema(
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

const OnBackStagePeople = mongoose.model(
  "OnBackStagePeople",
  onBackStagePeopleSchema
);
module.exports = OnBackStagePeople;
