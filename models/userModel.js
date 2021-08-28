/* eslint-disable no-console */
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { nanoid } = require("nanoid");

const userSchema = new mongoose.Schema(
  {
    userSerialNo: {
      type: Number,
    },
    firstName: {
      type: String,
      required: [true, "Please tell us your first name."],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please tell us your last name."],
      trim: true,
    },
    organisation: {
      type: String,
      default: "Google Inc.", // TODO This needs to fixed
    },
    designation: {
      type: String,
      default: "Vice President", // TODO This needs to fixed
    },
    city: {
      type: String,
      default: "Los Angeles", // TODO This needs to fixed
    },
    country: {
      type: String,
      default: "USA", // TODO This needs to fixed
    },
    headline: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    initialisedAt: {
      type: Date,
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now(),
    },
    image: {
      type: String,
      // default: "60e1c15b557681e9fc6af91e/20190907_105616.jpg",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,

      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },

    googleId: {
      type: String,
    },
    linkedinId: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    policySigned: {
      type: Boolean,
      required: [true, "A user must signin policy"],
      validate: {
        validator: (val) => val === true,
        message: "A user must sign the policy before using this application",
      },
    },
    subscribedToMailList: {
      type: Boolean,
      default: true,
    },
    eventTransactionIds: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "EventTransaction",
      },
    ],
    whatAreYouPlanningToDo: {
      type: String,
      enum: [
        "I'm looking for events to attend",
        "I want to host an event",
        "I want to do both",
      ],
    },
    interests: {
      type: [String],

      enum: [
        "Technology",
        "Education",
        "Lifestyle",
        "Professional Development",
        "Arts and crafts",
        "Business & Enterpreneurship",
        "Job Search",
        "Entertainment",
        "Health",
        "Crypto",
        "Web Security",
      ],
    },
    socialMediaHandles: {
      type: Map,
      of: String,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    communities: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Community",
      },
    ],
    registeredInEvents: [{ type: mongoose.Schema.ObjectId, ref: "Event" }],
    registrations: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Registration",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Review",
      },
    ],
    queries: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Query",
      },
    ],
    notificationsForRegisteredEvents: {
      type: Boolean,
      default: false,
    },
    notificationsForEventRemainder: {
      type: Boolean,
      default: false,
    },
    notificationsForRegisteredEvents: {
      type: Boolean,
      default: false,
    },
    notificationBasedOnMyPreference: {
      type: Boolean,
      default: false,
    },
    referralCode: {
      type: String,
      default: nanoid(10),
    },
    referrer: {
      // Here store the user id of who ever referred this person and null by default
      type: String,
    },
    signupUsingReferral: {
      type: Number,
      default: 0,
    },
    upgrades: {
      type: Number,
      default: 0,
    },
    credit: {
      type: Number,
      default: 0,
    },
    hasUsedAnyReferral: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// userSchema.pre(/^find/, function (next) {
//   // this points to the current query

//   this.populate({ path: "communities.communityId", select: "name" });
//   this.populate({
//     path: "registredInEvents",
//   });
//   next();
// });

userSchema.pre("save", async function (next) {
  //Only run this function  if password was actually modified
  if (!this.isModified("password")) {
    return next();
  }
  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimeStamp, JWTTimeStamp);
    return JWTTimeStamp < changedTimeStamp;
  }

  // FALSE MEANS NOT CHANGED
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
