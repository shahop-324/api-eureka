const mongoose = require("mongoose");

const mailSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
    },
    brandImage: {
      type: String,
    },
    customBranding: {
      type: Boolean,
      default: false,
    },
    eventId: {
      type: String,
    },
    templateName: {
      type: String,
    },
    subject: {
      type: String,
    },
    preHeader: {
      type: String,
    },
    body: {
      type: String,
    },
    status: {
      type: String,
      default: "Draft",
    },
    timestamp: {
      type: Date,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Mail = mongoose.model("Mail", mailSchema);
module.exports = Mail;
