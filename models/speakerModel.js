const mongoose = require('mongoose');
const validator = require('validator');

const speakerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
      maxlength: 25,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      maxlength: 25,
    },
    email: {
      type: String,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    image: {
      type: String,
    },
    organisation: {
      type: String,
      trim: true,
      maxlength: 25,
    },
    designation: {
      type: String,
      trim: true,
      maxlength: 25,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 250,
    },
    sessions: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Session',
      },
    ],
    eventId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Event',
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

const Speaker = mongoose.model('Speaker', speakerSchema);

module.exports = Speaker;
