const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, 'An event name is required!'],
      trim: true,
      maxlength: [
        150,
        'A Community name must have less or equal than 150 characters',
      ],
    },
    shortDescription: {
      type: String,
      required: [true, 'A short description for an event is required'],
      trim: true,
      maxlength: [
        200,
        'A Community name must have less or equal than 150 characters',
      ],
    },
    completeDescription: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'An event must have a start date.'],
    },
    endDate: {
      type: Date,
      required: [true, 'An event must have a start date.'],
      validate: {
        // This only works on .Create() and .Save()
        validator: function (el) {
          return el > this.startDate; // Checking if end date is greater than start date
        },
        message: 'End date should be greater than start date.',
      },
    },
    startTime: {
      type: Date,
      required: [true, 'An event must have a start time.'],
      default: Date.now(),
    },
    endTime: {
      type: Date,
      required: [true, 'An event must have a end time.'],
      default: Date.now() + 6 * 60 * 60 * 1000,
    },
    Timezone: {
      type: String,
      required: [
        true,
        'Time zone is required to provide localtime at various places to the users.',
      ],
      enum: [
        // TODO Here I have to add all Time Zones
        '(GMT-10:00) Hawaii',
        '(GMT+5:30) Chennai, Kolkata, New delhi, Mumbai',
        '(GMT+5:45) Kathmandu',
      ],
      default: '(GMT+5:30) Chennai, Kolkata, New delhi, Mumbai',
    },
    visibility: {
      type: String,
      required: [true, 'An event can be either public or unlisted'],
      enum: ['Public', 'Unlisted'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'Community',
    },
    RegistrationLimit: {
      type: Number,
      default: 100000,
    },
    host: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'An event must have a Host.'],
      },
    ],
    speaker: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Speaker',
      },
    ],
    session: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Session',
      },
    ],
    booths: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Booth',
      },
    ],
    sponsors: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Sponsor',
      },
    ],
    registrations: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Registration',
      },
    ],
    queries: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Query',
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Review',
      },
    ],
    coupon: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Coupon',
      },
    ],
    eventAverageRating: {

      type: Number,
      default: 3,
    },
    numberOfRatingsReceived: {
      type: Number,
      default: 0,
    },

    communityRating: {
      type: Number,
    },

    tickets: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Ticket',
    }],
    minTicketPrice: {
      type: Number,
      default: 0,
    },
    maxTicketPrice: {
      type: Number,
      default: 0,
    },

     categories:[
       {
         type:String,
         enum:['Technology','Education','Carrer Fair','Professional Development','Health & Lifestyle','Marketing & Advertisting','Crypto','Web Security','Entertainment','Business & Entrepreneurship'],

       }
     ],




    status: {
      type: String,
      default: 'active',
    },


    // TODO I have to do research on how recording will work and where it will be stored.
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

eventSchema.index({ eventName: "text" });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
