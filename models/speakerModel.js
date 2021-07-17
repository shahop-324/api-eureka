const mongoose = require('mongoose');
const validator = require('validator');

const speakerSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Active", "Inactive", "Deleted"],
      default: "Active",
    },
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
  
    headline: {
      type: String,
      trim: true,
      maxlength: 250,
     // default:"Co-Founder & CMO, Digital Strategy, Marketing & Strategic Partnership, Meylah"
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
    socialMediaHandles:{
      type :Map,
      of:String
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
speakerSchema.index({ firstName: "text",lastName:"text",headline:"text" });



speakerSchema.pre(/^find/, function(next) {
 
  this.find({ status: { $ne: "Deleted" } });
  next();
});

const Speaker = mongoose.model('Speaker', speakerSchema);

module.exports = Speaker;
