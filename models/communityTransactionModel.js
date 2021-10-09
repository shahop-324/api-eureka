const mongoose = require("mongoose");

const CommunityTransactionSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
    },
    purchasedBy: {
      type: String,
    },
    price: {
      type: Number,
    },
    currency: {
        type: String,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    transactionId: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const CommunityTransaction = mongoose.model(
  "CommunityTransaction",
  CommunityTransactionSchema
);
module.exports = CommunityTransaction;
