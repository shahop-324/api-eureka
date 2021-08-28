const mongoose = require("mongoose");

const availableForNetworkingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    userName: {
      type: String,
    },
    image: {
      type: String,
    },
    eventId: {
      type: String,
    },
    socketId: {
      type: String,
    },
    status: {
      type: String,
      default: "Available",
      // Available, Occupied
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const AvailableForNetworking = mongoose.model(
  "AvailableForNetworking",
  availableForNetworkingSchema
);
module.exports = AvailableForNetworking;
