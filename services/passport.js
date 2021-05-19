const jwt = require("jsonwebtoken");
const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const facebookStrategy = require("passport-facebook").Strategy;
const User = mongoose.model("User");
const linkedinStrategy = require("passport-linkedin-oauth2").Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      callbackURL: "/eureka/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        //  we already have a record with the given profile ID
        done(null, existingUser);
      } else {
        const user = await new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          policySigned: true,
          subscribedToMailList: true,
        }).save({ validateModifiedOnly: true });
        done(null, user);
      }
    }
  )
);

// facebook strategy
passport.use(
  new facebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,

      callbackURL: "/eureka/v1/auth/facebook/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ facebookId: profile.id });
      if (existingUser) {
        //  we already have a record with the given profile ID
        done(null, existingUser);
      } else {
        const user = await new User({
          facebookId: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          policySigned: true,
          subscribedToMailList: true,
        }).save({ validateModifiedOnly: true });
        done(null, user);
      }
    }
  )
);

// linkedin strategy
passport.use(
  new linkedinStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: "/eureka/v1/auth/linkedin/callback",
      scope: ["r_liteprofile"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ linkedinId: profile.id });
      if (existingUser) {
        //  we already have a record with the given profile ID
        done(null, existingUser);
      } else {
        const user = await new User({
          linkedinId: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          policySigned: true,
          subscribedToMailList: true,
        }).save({ validateModifiedOnly: true });
        done(null, user);
      }
    }
  )
);
