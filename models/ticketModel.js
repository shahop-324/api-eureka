const mongoose = require("mongoose");
const ticketSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.ObjectId,
      ref: "Event",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Deleted"],
      default: "Active",
    },
    currency: {
      type: String,
      default: "USD",
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    venueAreasAccessible: [
      {
        type: String,
      },
    ],
    shareRecording: {
      type: Boolean,
      default: false,
    },
    numberOfTicketAvailable: {
      type: Number,
      required: [
        true,
        "You must specify amount of ticket of this type to be made available.",
      ],
    },
    numberOfTicketSold: {
      type: Number,
      default: 0,
    },
    ticketIsSoldOut: {
      type: Boolean,
      default: false,
    },
    initiatedAt: {
      type: Date,
    },

    lastUpdatedAt: {
      type: Date,
      default: Date.now(),
    },
    // Leaderboard winner prices and other sharable event assets or resources.
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ticketSchema.index({
  name: "text",
  description: "text",
  price: "text",
  currency: "text",
  status: "text",
});

ticketSchema.pre(/^find/, function (next) {
  this.find({ status: { $ne: "Deleted" } });
  next();
});

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
