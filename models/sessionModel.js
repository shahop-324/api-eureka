const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Event',
    },

    name: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
      default:Date.now() //todo
    },
    duration: {
      type: Number,
    },
    host: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    speaker: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Speaker',
      },
    ],
    agenda: {
      type: String,
    },
    summary: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    description:{
      type:String,
      default:"From combatting Email Fraud to Building Your Brand! Research: Stories about brands being phished, loss of trust due to phishing, Success stories due to DMARC"
    },
   
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
