const mongoose = require("mongoose");
const usersInEventSchema = new mongoose.Schema(
  {
    tag: {
      type: String, // Can be User || Speaker || Exhibitor
    },
    status: {
      type: String,
      default: "Active",
    },
    room: {
      type: mongoose.Schema.ObjectId,
      ref: "Event",
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    userName: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    userCity: {
      type: String,
    },
    userCountry: {
      type: String,
    },
    userDesignation: {
      type: String,
    },
    userOrganisation: {
      type: String,
    },
    userImage: {
      type: String,
    },
    socketId: {
      type: String,
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const UsersInEvent = mongoose.model("UsersInEvent", usersInEventSchema);
module.exports = UsersInEvent;
