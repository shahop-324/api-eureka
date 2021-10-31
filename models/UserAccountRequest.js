const mongoose = require("mongoose");
const userAccountRequestSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "Not Yet Claimed",
      enum: ["Not Yet Claimed", "Claimed", "Claimed By Someone Else"],
    },
    expired: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    expiresAt: {
      type: Date, // Timestamp of creation + 14 days
    },
    email: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const UserAccountRequest = mongoose.model(
  "UserAccountRequest",
  userAccountRequestSchema
);
module.exports = UserAccountRequest;
