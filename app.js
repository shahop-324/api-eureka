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

const jsforce = require("jsforce");
const passport = require("passport");
const xss = require("xss-clean");

const globalErrorHandler = require("./controllers/errController");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const session = require("cookie-session");
const Event = require("./models/eventModel");
var request = require("superagent");

const querystring = require("querystring");

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
const paypalRoutes = require("./routes/payPalRoutes");

// const { initialize } = require("passport");
const authController = require("./controllers/authController.js");

const MailChimp = require("./models/mailChimpModel");

const Hubspot = require("./models/hubspotModel");
const Community = require("./models/communityModel");

const { promisify } = require("util");
require("./services/passport");

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

console.log(process.env.NODE_ENV, "klljlkl;kmfghytredswrtyuiop");
const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:3000"
    : "https://www.evenz.co.in";

const OAUTH_CALLBACK = `${BASE_URL}/api-eureka/eureka/v1/oauth/mailchimp/callback`;

app.use(
  cors({
    origin: [
      "http://127.0.0.1:3001",
      "http://localhost:3001",
      "https://www.bluemeet.in",
      "https://www.evenz.co.in",
      "https://evenz.co.in",
    ],

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
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100000,
  windowMs: 60 * 60 * 1000, // In one hour
  message: "Too many Requests from this IP, please try again in an hour!",
});

app.use("/eureka", limiter);

app.use(express.json({ limit: "10kb" }));

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
app.use("/api-eureka/eureka/v1/paypal", paypalRoutes);

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

app.get("/api-eureka/eureka/v1/current_user", (req, res) => {
  const token = signToken(req.user._id);

  res.send({ user: req.user, token: token });
});

app.get("/api-eureka/eureka/v1/auth/mailchimp", async (req, res) => {
  res.redirect(
    `https://login.mailchimp.com/oauth2/authorize?${querystring.stringify({
      response_type: "code",
      client_id: MAILCHIMP_CLIENT_ID,
      redirect_uri: OAUTH_CALLBACK,
    })}`
  );
});

app.get("/api-eureka/eureka/v1/oauth/mailchimp/callback", (req, res) => {
  console.log(req.query.code, "i am counting on you req.query.code");
  let accessToken = null;
  const config = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };
  const parameters = {
    grant_type: "authorization_code",
    code: req.query.code,
    client_id: MAILCHIMP_CLIENT_ID,
    client_secret: MAILCHIMP_CLIENT_SECRET,
    redirect_uri: OAUTH_CALLBACK,
  };

  axios
    .post(
      "https://login.mailchimp.com/oauth2/token",
      qs.stringify(parameters),
      config
    )
    .then((response) => {
      accessToken = response.data.access_token;
      console.log(accessToken, "i am counting on you access token");

      axios
        .get("https://login.mailchimp.com/oauth2/metadata", {
          headers: {
            Authorization: `OAuth ${accessToken}`,
          },
        })
        .then((metadataResponse) => {
          console.log(
            metadataResponse,
            "I am counting on you metaDataResponse"
          );
          console.log(
            metadataResponse.data.login.email,
            "I am counting on you metadataResponse.data.login.email"
          );
          Community.findOne({ email: metadataResponse.data.login.email }).then(
            (community) => {
              console.log(community, "i am counting on you community");

              MailChimp.findOne({ communityId: community._id }).then(
                (mailChimpCommunityAccount) => {
                  console.log(
                    mailChimpCommunityAccount,
                    "i am counting on you mailChimpAccount"
                  );
                  if (!mailChimpCommunityAccount) {
                    MailChimp.create({
                      communityId: community._id,
                      accessToken,
                      server: metadataResponse.data.dc,

                      apiEndPoint: metadataResponse.data.api_endpoint,
                    }).then(async () => {
                      console.log(
                        community,
                        "I am counting on you commmunity for save error checking"
                      );
                      community.isMailChimpConnected = true;
                      // const [a] = community;
                      await community.save({
                        new: true,

                        validateModifiedOnly: true,
                      });

                      console.log(
                        "mailChimpCommunityCreated",
                        "hey i am counting on you mailchimp community id"
                      );
                      res.status(200).json({
                        status: "SUCCESS",
                      });
                    });
                  } else {
                    res.status(200).json({
                      status: "You already have one for same communityId",
                    });
                  }
                }
              );
            }
          );
        });
    });
});

app.get(
  "/api-eureka/eureka/v1/fetchMailChimpAudiences",
  async (req, res, next) => {
    // 1. find by community id by event id
    console.log(req.query.eventId, "i am counting on you req.query.eventId");
    const eventData = await Event.findById(req.query.eventId);

    //2. find the mailchimp account with community id

    const communityId = eventData.createdBy;
    console.log(communityId, "i am counting on you communityId");

    const mailChimpData = await MailChimp.findOne({ communityId });
    console.log(mailChimpData, "I am counting on you mailChimpData");
    //3. dynamically form request for fetching list

    //  fetch(`https://${mailChimpData.server}.api.mailchimp.com/3.0/lists`)
    // https://us5.api.mailchimp.com
    request
      .get(mailChimpData.apiEndPoint + "/3.0/lists")
      .set("Accept", "application/json")
      .set("Authorization", "OAuth " + mailChimpData.accessToken)
      .end((err, result) => {
        if (err) {
          res.status(500).json(err);
        } else {
          console.log(
            result.body.lists,
            "i am counting on you request.body.lists"
          );
          res.json(result.body.lists);
        }
      });
  }
);

app.get("/api-eureka/eureka/v1/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
app.use("/api-eureka/eureka/v1", globalRoutes);
app.use(globalErrorHandler);

app.get("/api-eureka/eureka/v1/auth/salesforce", function (req, res) {
  const oauth2 = new jsforce.OAuth2({
    clientId: process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET_ID,
    redirectUri: process.env.SALESFORCE_REDIRECT_URI,
  });
  res.redirect(oauth2.getAuthorizationUrl({}));
});

app.get("/api-eureka/eureka/v1/oauth/salesforce/callback", (req, res) => {
  console.log(req.query.code, "I am counting on you salesforce code");

  const oauth2 = new jsforce.OAuth2({
    clientId: process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET_ID,
    redirectUri: process.env.SALESFORCE_REDIRECT_URI,
  });
  const conn = new jsforce.Connection({ oauth2: oauth2 });
  conn.authorize(req.query.code, function (err, userInfo) {
    if (err) {
      return console.error(err);
    }
    const conn2 = new jsforce.Connection({
      instanceUrl: conn.instanceUrl,
      accessToken: conn.accessToken,
    });

    conn2
      .sobject("Account__c")
      .create({ Name: "dino testing" }, function (err, ret) {
        if (err || !ret.success) {
          return console.error(err, ret);
        }

        const conn3 = new jsforce.Connection({
          instanceUrl: conn.instanceUrl,
          accessToken: conn.accessToken,
        });

        console.log("Created record id : " + ret.id);
        conn3.sobject("Account__c").retrieve(ret.id, function (err, account) {
          if (err) {
            return console.error(err);
          }
          console.log("Name : " + account.Name);
          // ...
        });

        // ...
      });

    conn2.identity(function (err, res) {
      if (err) {
        return console.error(err);
      }
      console.log("user ID: " + res.user_id);
      console.log("organization ID: " + res.organization_id);
      console.log("username: " + res.username);
      console.log("display name: " + res.display_name);
    });
  });

  res.status(200).json({
    status: "SUCCESS",
  });
});

module.exports = app;
