/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const axios = require("axios");
const qs = require("query-string");
const morgan = require("morgan");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongosanitize = require("express-mongo-sanitize");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const xss = require("xss-clean");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errController");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const session = require("cookie-session");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

const querystring = require("querystring");
const http = require("http");
const socketio = require("socket.io");
// Imported Routes for Various Resources

const uploadRoutes = require("./routes/uploadRoutes");
const userRoutes = require("./routes/userRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const communityRoutes = require("./routes/communityRoutes");
const globalRoutes = require("./routes/globalRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const authRoutes = require("./routes/authRoutes");
const salesDepartmentRoutes = require("./routes/salesDepartmentRoutes");
const customPlanRoutes = require("./routes/customPlanRoutes");
const eventRoutes = require("./routes/eventRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const speakerRoutes = require("./routes/speakerRoutes");
const boothRoutes = require("./routes/boothRoutes");
const sponsorRoutes = require("./routes/sponsorRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const razorpayRoutes = require("./routes/razorpayRoutes.js");
const teamInvite = require("./routes/teamInviteRoutes");
const demoRoutes = require("./routes/demoRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const contactUsRoutes = require("./routes/contactUsRoutes");
const twillioRoutes = require("./routes/twillioRoutes");
const fundTransferRoutes = require("./routes/fundTransferRoutes");
const communityPlanRoutes = require("./routes/communityPlanRoutes");
const affiliateRoutes = require("./routes/affiliateRoutes");
const interestedPeopleRoutes = require("./routes/interestedPeopleRoutes");
// const { initialize } = require("passport");
const authController = require("./controllers/authController.js");
const { promisify } = require("util");
require("./services/passport");

// Created a new express app
const app = express();
const urlToGetLinkedInAccessToken =
  "https://www.linkedin.com/oauth/v2/accessToken";
const urlToGetUserProfile =
  "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))";
const urlToGetUserEmail =
  "https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))";

const MAILCHIMP_CLIENT_ID = "919814706970";
const MAILCHIMP_CLIENT_SECRET =
  "3837302297576b7845b5ced8bd4691bb69ac7b8c5f90645887";
const BASE_URL = "http://127.0.0.1:3000";
const OAUTH_CALLBACK = `${BASE_URL}/api-eureka/oauth/mailchimp/callback`;

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://www.evenz.in",
      "https://www.evenz.co.in",
      "https://evenz.co.in",
    ],
    //origin: "*",
    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],

    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    secret: "keyboard cat",
    proxy: true,
    resave: true,
    saveUnintialized: true,
    cookie: {
      secure: false,
    },
    // maxAge: 30 * 24 * 60 * 60 * 1000,
    // keys: [process.env.COOKIE_KEY],
  })
);
// app.use(session({ secret: "anything" }));
// console.log(initialise, session);

app.use(passport.initialize());
app.use(passport.session());

// 1. GLOBAL MIDDLEWARES

// passport.js middleware functions

// Set security HTTP headers
app.use(helmet());

// Development Logging
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit Request rate from same IP
const limiter = rateLimit({
  max: 100000,
  windowMs: 60 * 60 * 1000, // In one hour
  message: "Too many Requests from this IP, please try again in an hour!",
});

app.use("/eureka", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" })); // Middleware // use method is used to add middlewares to our middleware stack

// app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(mongosanitize());

app.use(xss());

app.get("/api-eureka/getUserCredentials", (req, res) => {
  const code = req.query.code;
  let userProfile = {};
  let resStatus = 400;
  let accessToken = null;
  const config = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };
  const parameters = {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: process.env.REDIRECT_URI,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  };
  axios
    .post(urlToGetLinkedInAccessToken, qs.stringify(parameters), config)
    .then((response) => {
      accessToken = response.data.access_token;
      console.log(accessToken);
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      axios
        .get(urlToGetUserProfile, config)
        .then((response) => {
          userProfile.firstName = response.data["localizedFirstName"];
          userProfile.lastName = response.data["localizedLastName"];
          userProfile.image =
            response.data.profilePicture[
              "displayImage~"
            ].elements[0].identifiers[0].identifier;
          userProfile.linkedinId = response.data.id;

          axios
            .get(urlToGetUserEmail, config)
            .then((response) => {
              userProfile.email =
                response.data.elements[0]["handle~"].emailAddress;

              res.status(200).json({ userProfile });
              // }
            })
            .catch((error) => console.log("Error getting user email"));
        })
        .catch((error) => console.log("Error grabbing user profile"));
    })
    .catch((err) => {
      console.log("Error getting LinkedIn access token");
    });
});

app.use("/api-eureka/eureka/v1/auth", authRoutes);
app.use("/api-eureka/eureka/v1/upload", uploadRoutes);
app.use("/api-eureka/eureka/v1/users", userRoutes);
app.use("/api-eureka/eureka/v1/registrations", registrationRoutes);
app.use("/api-eureka/eureka/v1/community", communityRoutes);
app.use("/api-eureka/eureka/v1/feedback", feedbackRoutes);
app.use("/api-eureka/eureka/v1/sales", salesDepartmentRoutes);
app.use("/api-eureka/eureka/v1/customPlan", customPlanRoutes);
app.use("/api-eureka/eureka/v1/events", eventRoutes);
app.use("/api-eureka/eureka/v1/sessions", sessionRoutes);
app.use("/api-eureka/eureka/v1/speakers", speakerRoutes);
app.use("/api-eureka/eureka/v1/booths", boothRoutes);
app.use("/api-eureka/eureka/v1/sponsors", sponsorRoutes);
app.use("/api-eureka/eureka/v1/stripe", stripeRoutes);
app.use("/api-eureka/eureka/v1/razorpay", razorpayRoutes);
app.use("/api-eureka/eureka/v1/tickets", ticketRoutes);
app.use("/api-eureka/eureka/v1/team-invites", teamInvite);
app.use("/api-eureka/eureka/v1/demo", demoRoutes);
app.use("/api-eureka/eureka/v1/newsletter", newsletterRoutes);
app.use("/api-eureka/eureka/v1/contactUs", contactUsRoutes);
app.use("/api-eureka/eureka/v1/twillio", twillioRoutes);
app.use("/api-eureka/eureka/v1/fund", fundTransferRoutes);
app.use("/api-eureka/eureka/v1/communityPlan", communityPlanRoutes);
app.use("/api-eureka/eureka/v1/affiliate", affiliateRoutes);
app.use("/api-eureka/eureka/v1/interestedPeople", interestedPeopleRoutes);

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  //remove password from output

  res.status(statusCode).json({
    status: "success",

    token,
    data: {
      user,
    },
  });
};
app.get("/api-eureka/eureka/v1/current_user", (req, res) => {
  // createSendToken(req.user,200,req,res)
  const token = signToken(req.user._id);

  res.send({ user: req.user, token: token });
});

// 2. The login link above will direct the user here, which will redirect
// to Mailchimp's OAuth login page.
app.get("/api-eureka/auth/mailchimp", (req, res) => {
  res.redirect(
    `https://login.mailchimp.com/oauth2/authorize?${querystring.stringify({
      response_type: "code",
      client_id: MAILCHIMP_CLIENT_ID,
      redirect_uri: OAUTH_CALLBACK,
    })}`
  );
});

// 3. Once // 3. Once the user authorizes your app, Mailchimp will redirect the user to
// this endpoint, along with a code you can use to exchange for the user's
// access token.
app.get("/api-eureka/oauth/mailchimp/callback", async (req, res) => {
  // Here we're exchanging the temporary code for the user's access token.
  const tokenResponse = await fetch(
    "https://login.mailchimp.com/oauth2/token",
    {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: MAILCHIMP_CLIENT_ID,
        client_secret: MAILCHIMP_CLIENT_SECRET,
        redirect_uri: OAUTH_CALLBACK,
        code: req.body.code,
      }),
    }
  );

  const { access_token } = await tokenResponse.json();
  console.log(access_token);

  // Now we're using the access token to get information about the user.
  // Specifically, we want to get the user's server prefix, which we'll use to
  // make calls to the API on their behalf.  This prefix will change from user
  // to user.
  const metadataResponse = await fetch(
    "https://login.mailchimp.com/oauth2/metadata",
    {
      headers: {
        Authorization: `OAuth ${access_token}`,
      },
    }
  );

  const { dc } = await metadataResponse.json();
  console.log(dc);

  // Below, we're using the access token and server prefix to make an
  // authenticated request on behalf of the user who just granted OAuth access.
  // You wouldn't keep this in your production code, but it's here to
  // demonstrate how the call is made.

  mailchimp.setConfig({
    accessToken: access_token,
    server: dc,
  });

  const response = await mailchimp.ping.get();
  console.log(response);

  res.send(`
    <p>This user's access token is ${access_token} and their server prefix is ${dc}.</p>

    <p>When pinging the Mailchimp Marketing API's ping endpoint, the server responded:<p>

    <code>${response}</code>
  `);

  // In reality, you'd want to store the access token and server prefix
  // somewhere in your application.
  // fakeDB.getCurrentUser();
  // fakeDB.storeMailchimpCredsForUser(user, {
  //   dc,
  //   access_token
  // });
});

app.get("/api-eureka/eureka/v1/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
app.use("/api-eureka/eureka/v1", globalRoutes);
app.use(globalErrorHandler);

module.exports = app;
