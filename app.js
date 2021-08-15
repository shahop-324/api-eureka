/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

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
const session = require('cookie-session');


const http = require('http');
const socketio = require('socket.io');
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
// const { initialize } = require("passport");

require("./services/passport");

// Created a new express app
const app = express();

app.use(
  cors({
     origin: ["http://localhost:3001", "https://www.evenz.in", "https://www.evenz.co.in", "https://evenz.co.in"],
    //origin: "*",
    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],

    credentials: true,
  })
);

app.use(cookieParser());

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
console.log(process.env.NODE_ENV);
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
app.use(express.urlencoded({
  extended: true
}));

// app.use(bodyParser.json());


// Data sanitization against NoSQL query injection
app.use(mongosanitize());

// Data sanitization against XSS
app.use(xss());
//test middleware
app.use((req, res, next) => {
  console.log("hello form cookie middleware");
  console.log(req.cookies);
  next();
});
// All routes
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
app.use("/api-eureka/eureka/v1/team-invites",teamInvite);
app.use("/api-eureka/eureka/v1/demo",demoRoutes);
app.use("/api-eureka/eureka/v1/newsletter",newsletterRoutes);
app.use("/api-eureka/eureka/v1/contactUs",contactUsRoutes);
app.use("/api-eureka/eureka/v1/twillio", twillioRoutes);

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
 
    
  res.send({user:req.user,token:token});
});

app.get("/api-eureka/eureka/v1/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
app.use("/api-eureka/eureka/v1", globalRoutes);
app.use(globalErrorHandler);

module.exports = app;
