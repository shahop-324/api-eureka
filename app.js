/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const morgan = require("morgan");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongosanitize = require("express-mongo-sanitize");
const cookieSession = require("cookie-session");
const passport = require("passport");
const xss = require("xss-clean");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errController");
const cors=require("cors");
const cookieParser =require("cookie-parser")
// Imported Routes for Various Resources
const userRoutes = require("./routes/userRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const communityRoutes = require("./routes/communityRoutes");
const globalRoutes = require("./routes/globalRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const authRoutes = require("./routes/authRoutes");
const salesDepartmentRoutes = require('./routes/salesDepartmentRoutes');
const customPlanRoutes = require('./routes/customPlanRoutes');
// const { initialize } = require("passport");

require("./services/passport");

// Created a new express app
const app = express();
app.use(cors());
// app.use(cors({
//   origin:'http://localhost:3001'
// }))
 app.options('*',cors());

app.use(cookieParser());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);

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

// Data sanitization against NoSQL query injection
app.use(mongosanitize());

// Data sanitization against XSS
app.use(xss());
//test middleware 
app.use((req,res,next)=>{
 console.log("hello form cookie middleware")
  console.log(req.cookies);
  next();
})
// All routes
app.use("/eureka/v1/auth", authRoutes);
app.use("/eureka/v1/users", userRoutes);
app.use("/eureka/v1/registration", registrationRoutes);
app.use("/eureka/v1/community", communityRoutes);
app.use("/eureka/v1/feedback", feedbackRoutes);
app.use('/eureka/v1/sales', salesDepartmentRoutes);
app.use('/eureka/v1/customPlan', customPlanRoutes);
let x;
app.use((req,res,next)=>{
   console.log(req.user);
    x =req.user;
    next();
})

app.get('/eureka/v1/current_user',(req,res)=>{

  res.send(x);
  // res.send(req.user);
})
app.get('/eureka/v1/logout',(req,res)=>{
  req.logout();
  res.send(req.user);
})
app.use("/eureka/v1", globalRoutes);
app.use(globalErrorHandler);


module.exports = app;
