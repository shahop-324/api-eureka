const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    registrationType: {
      type: String,
      enum: ["Pre Event Sale", "Post Event Sale"],
    },
    eventName: {
      type: String,
    },
    userName: {
      type: String,
    },
    userImage: {
      type: String,
    },
    userEmail: {
      type: String,
    },
  
    ticketType: {
      type: String,
    },
   
    eventTransactionId: {
      type: mongoose.Schema.ObjectId,
      ref: "EventTransaction",
    },
    ticketId: {
      type: mongoose.Schema.ObjectId,
      ref: "Ticket",
    },
    totalAmountPaid: {
      type: Number,
    },
    currency: {
      type: String,
    },
    orderId: {
      type: String,
    },
    
    paymentStatus: {
      type: String,
    },
    paymentDescription: {
      type: String,
    },
    bookedByUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    bookedForEventId: {
      type: mongoose.Schema.ObjectId,
      ref: "Event",
    },
    appliedCouponId: {
      type: String,
    },
    eventByCommunityId: {
      type: mongoose.Schema.ObjectId,
      ref: "Community",
    },
    createdAt: {
      type: Date,
    },
    // * NEW
    invitationLink: {
      type: String,
    },
    addedVia: {
      type: String,
      enum: ["Registration", "Invitation"],
    },

    // Form to be filled during registration.
    // Accessible venue areas, recordings and assets or add ons
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Registration = mongoose.model("Registration", registrationSchema);
module.exports = Registration;
