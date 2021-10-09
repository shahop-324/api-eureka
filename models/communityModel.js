const mongoose = require("mongoose");
const validator = require("validator");

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please assign a name to your community"],
      unique: true,
      trim: true,
      maxlength: [
        100,
        "A Community name must have less or equal than 100 characters",
      ],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide your community email"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    headline: {
      type: String,
      trim: true,
      required: [true, "Please provide a short description of your community"],
      maxlength: [
        100,
        "A Community name must have less or equal than 100 characters",
      ],
    },
    isSalesForceConnected: {
      type: Boolean,
      default: false,
    },

    policySigned: {
      type: Boolean,
      required: [true, "A community must sign policy"],
      validate: {
        validator: (val) => val === true,
        message:
          "A community must sign the policy before using this application",
      },
    },
    hubspotApiKey: {
      type: String,
    },

    subscribedToCommunityMailList: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    planName: {
      type: String,
      default: "Free",
    },
    isConnectedMailChimp: {
      type: Boolean,
      default: false,
    },
    // ! /////////////////////////////////////////////////////////////////////////
    allowedRegistrationLimit: {
      type: Number,
      default: 10,
    },
    registrationsReceived: {
      type: Number, // This will be resetted to 0 at the end of every billing cycle.
      default: 0,
    },
    cloudStorageLimit: {
      type: Number, // In GB
    },
    storageLimitUtilised: {
      type: Number,
    },
    emailLimit: {
      type: Number, // Limit on emails that can be sent
    },
    emailLimitUsed: {
      type: Number,
    },
    streamingHoursLimit: {
      type: Number, // Limit on streaming hours
    },
    streamingHoursUsed: {
      type: Number,
    },
    organisersLimit: {
      type: Number, // Limit on number of organisers in team
    },
    organisersLimitUsed: {
      type: Number,
    },
    planName: {
      type: String,
      default: "Free",
    },
    isUsingFreePlan: {
      type: Boolean,
      default: true,
    },

    planTransactions: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "CommunityTransaction",
      },
    ],
    planExpiresAt: {
      type: Date,
    },
    // ! ////////////////////////////////////////////////////////////////
    coupons: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Coupon",
      },
    ],
    eventsDocIdCommunityWise: {
      type: mongoose.Schema.ObjectId,
    },
    reviewsDocIdCommunityWise: {
      type: mongoose.Schema.ObjectId,
    },
    queriesDocIdCommunityWise: {
      type: mongoose.Schema.ObjectId,
    },
    registrationsDocIdCommunityWise: {
      type: mongoose.Schema.ObjectId,
    },
    speakersDocIdCommunityWise: {
      type: mongoose.Schema.ObjectId,
    },
    eventTransactionDocIdCommunityWise: {
      type: mongoose.Schema.ObjectId,
    },
    analytics: {
      follwersCount: {
        type: Number,
        default: 0,
      },

      followersGainedPreviousDay: {
        type: Number,
        default: 0,
      },

      followersGainedThisDay: {
        type: Number,
        default: 0,
      },

      followersGainedInPreviousMonth: {
        type: Number,
      },

      followersGainedThisMonth: {
        type: Number,
        default: 0,
      },
      followersGainedThisPreviousYear: {
        type: Number,
        default: 0,
      },

      followersGainedThisYear: {
        type: Number,
        default: 0,
      },

      totalRevenue: {
        type: Number,
        default: 0,
      },

      revenueThisMonth: {
        type: Number,
        default: 0,
      },
      revenuePreviousMonth: {
        type: Number,
        default: 0,
      },
      revenueThisDay: {
        type: Number,
        default: 0,
      },
      revenuePreviousDay: {
        type: Number,
        default: 0,
      },
      revenuePreviousYear: {
        type: Number,
        default: 0,
      },
      revenueThisYear: {
        type: Number,
        default: 0,
      },
      revenuePreviousWeek: {
        type: Number,
        default: 0,
      },
      revenueThisWeek: {
        type: Number,
        default: 0,
      },
      revenueYesterday: {
        type: Number,
        default: 0,
      },
      revenueToday: {
        type: Number,
        default: 0,
      },
      totalRegistrations: {
        type: Number,
        default: 0,
      },

      totalRegistrationsPreviousMonth: {
        type: Number,
        default: 0,
      },

      totalRegistrationsThisMonth: {
        type: Number,
        default: 0,
      },
      totalRegistrationsPreviousWeek: {
        type: Number,
        default: 0,
      },

      totalRegistrationsThisWeek: {
        type: Number,
        default: 0,
      },
      totalRegistrationsYesterday: {
        type: Number,
        default: 0,
      },

      totalRegistrationsToday: {
        type: Number,
        default: 0,
      },
      totalRegistrationsPreviousDay: {
        type: Number,
        default: 0,
      },
      totalRegistrationsThisDay: {
        type: Number,
        default: 0,
      },
      totalRegistrationsPreviousYear: {
        type: Number,
        default: 0,
      },
      totalRegistrationsThisYear: {
        type: Number,
        default: 0,
      },
    },

    commuintyAverageRating: {
      type: Number,
      default: 4,
    },

    numberOfRatingsRecieved: {
      type: Number,
      default: 0,
    },
    socialMediaHandles: {
      type: Map,
      Of: String,
    },
    connectedToStripe: {
      type: Boolean,
      default: false,
    },
    stripeAccountId: {
      type: String,
    },
    paypalTrackingId: {
      type: String,
    },
    paymentGateway: {
      type: String,
      enum: ["Razorpay", "Paypal"],
    },
    paypalOnboardingData: {
      type: Map,
      of: String,
    },
    billingPlansTransactionIds: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "BillingTransaction",
      },
    ],
    coverPhoto: String,
    image: String,
    superAdmin: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    superAdminName: {
      type: String,
    },
    superAdminEmail: {
      type: String,
    },
    superAdminImage: {
      type: String,
    },
    eventManagers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    notYetAcceptedInvitations: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "TeamInvite",
      },
    ],
    tawkLink: {
      type: String,
    },
    eventbritePrivateToken: {
      type: String,
    },
    credentials: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "CommunityCredentials",
      },
    ],
    connectedStripeAccountId: {
      type: String,
    },
    isStripeEnabled: {
      type: Boolean,
      default: false,
    },
    verifiedStripeAccountId: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const Community = mongoose.model("Community", communitySchema);

module.exports = Community;
