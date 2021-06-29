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
      required: [true, "Please provide your community email"],
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    superAdmin: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "A community must have a Super Admin."],
      },
    ],
    headline: {
      type: String,
      trim: true,
      required: [true, "Please provide a short description of your community"],
      maxlength: [
        100,
        "A Community name must have less or equal than 100 characters",
      ],
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
    subscribedToCommunityMailList: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    planDetails: {
      planName: {
        type: String,
        enum: ["Free", "Starter", "Growth", "Business"],
      },
      planRenewDuration: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      },
      currentPlanExpiresOn: {
        type: Date,
      },
      features: {
        eventManagement: {
          ticketing: {
            type: Boolean,
          },
          registartionPage: {
            type: Boolean,
          },
          queries: {
            type: Boolean,
          },
          reviews: {
            type: Boolean,
          },
          email: {
            type: Boolean,
          },
          coupon: {
            type: Boolean,
          },
        },
        eventExperience: {
          reception: {
            type: Boolean,
          },
          messaging: {
            type: Boolean,
          },
          connection: {
            type: Boolean,
          },
          networking: {
            type: Boolean,
          },
          customNetworking: {
            type: Boolean,
          },
          multiSession: {
            type: Boolean,
          },
          multiTrack: {
            type: Boolean,
          },
          moderation: {
            type: Boolean,
          },
          liveStreaming: {
            type: Boolean,
          },
          RTMP: {
            type: Boolean,
          },
          twitterAndInstaWall: {
            type: Boolean,
          },
          photoBooth: {
            type: Boolean,
          },
          leaderShipBoard: {
            type: Boolean,
          },
          sponsorShoutout: {
            type: Boolean,
          },
        },
        customization: {
          email: {
            type: Boolean,
          },
          registrationForm: {
            type: Boolean,
          },
          stageBranding: {
            type: Boolean,
          },
        },
        analytics: {
          basic: {
            type: Boolean,
          },
          advanced: {
            type: Boolean,
          },
          realTimeAnalytics: {
            type: Boolean,
          },
        },
        integrations: {
          zapier: {
            type: Boolean,
          },
          miro: {
            type: Boolean,
          },
          limnu: {
            type: Boolean,
          },
          mailchimp: {
            type: Boolean,
          },
          socialMedia: {
            type: Boolean,
          },
          CRM: {
            type: Boolean,
          },
        },
        services: {
          emailAndChatSupport: {
            type: Boolean,
          },
          uptimeSLA: {
            type: Boolean,
          },
          onboardingAndTraining: {
            type: Boolean,
          },
        },
        moreDetails: {
          eventLength: {
            type: Number,
          },
          registrationsPerMonth: {
            type: Number,
          },
          speakersPerEvent: {
            type: Number,
          },
          maxTeamMembers: {
            type: Number,
          },
          ticketingCommission: {
            type: Number,
          },
          pricePerAdditionalRegistration: {
            type: Number,
          },
        },
      },
    },
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

      revenueThisMonth: {
        type: Number,
        default: 0,
      },
      totalRevenue: {
        type: Number,
        default: 0,
      },
      revenuePreviousMonth: {
        type: Number,
        default: 0,
      },
      revenueThisMonth: {
        type: Number,
        default: 0,
      },
      revenuePreviousDay: {
        type: Number,
        default: 0,
      },

      revenueThisDay: {
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
     type:Map,
     Of:String
    },

    coverPhoto: String,
    logo: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const Community = mongoose.model("Community", communitySchema);

module.exports = Community;
