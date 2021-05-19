const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      default: 'dummy',
    },
    name: {
      type: String,
    },
    photo: {
      type: String,
    },
    email: {
      type: String,
    },
    ticketType: {
      type: String,
      default: 'Regular Ticket',
    },
    bookedByUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    bookedForEventId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Event',
    },
    appliedCouponId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Coupon',
    },
    // TODO create fields for ticketType and ticketPrice paid
    ticketPDFawsRef: {
      type: String,
    },
    eventByCommunityId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Community',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Registration = mongoose.model('Registration', registrationSchema);
module.exports = Registration;
