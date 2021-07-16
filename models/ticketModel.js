const mongoose = require("mongoose");
const ticketSchema = new mongoose.Schema(
  {
    //   //name,price ,description,amountofticketLabel
    //   //community connected with stripe
    status: {
      type: String,
      enum: ["Active", "Inactive", "Deleted"],
      default: "Active",
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
    amountOfTicketAvailable: {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
