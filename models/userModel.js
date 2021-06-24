/* eslint-disable no-console */
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
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
    headline: {
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
    photo: String,
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    }, 
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    linkedInId: {
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
        "Business & Entrepreneurship",
        "Job Search",
        "Entertainment",
        "Health",
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
        communityId: {
          type: mongoose.Schema.ObjectId,
          ref: "Community",
          default: "609110268fb72211669e28c9",
        },
        role: {
          type: String,
          enum: ["superAdmin"],
          default: "superAdmin",
        },
      },
    ],
    registredInEvents: [{ type: mongoose.Schema.ObjectId, ref: "Event" }],
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

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

const User = mongoose.model("User", userSchema);
module.exports = User;
