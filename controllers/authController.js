/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Community = require("../models/communityModel");
const MailList = require("../models/emailListModel");
const SalesDepartment = require("../models/salesDepartmentModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync");

// this function will return you jwt token
const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

const signTokenForSalesLogin = (salesPersonId) =>
  jwt.sign({ salesPersonId }, process.env.JWT_SECRET);

const signTokenForCommunityLogin = (userId, communityId) =>
  jwt.sign(
    { userId: userId, communityId: communityId },
    process.env.JWT_SECRET
  );

// this function use signToken function for creating and sending token
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  //remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",

    token,
    data: {
      user,
    },
  });
};

const createSendTokenForSalesLogin = (salesPerson, statusCode, req, res) => {
  const token = signTokenForSalesLogin(salesPerson.salesPersonId);

  //remove password from output
  salesPerson.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      salesPerson,
    },
  });
};

const createSendTokenForCommunityLogin = async (
  userId,
  communityId,
  statusCode,
  req,
  res
) => {
  const token = signTokenForCommunityLogin(userId, communityId);
  res.status(statusCode).json({
    status: "success",
    token,
  });
};

// this function is signup function for users

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    initialisedAt: Date.now(),
    password: req.body.password,

    policySigned: req.body.policySigned,
  });

  const name = `${req.body.firstName} ${req.body.lastName}`;
  await MailList.create({
    name: name,
    email: req.body.email,
  });

  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email and password", 401));
  }

  // 3) If everything is ok, send json web token to client
  createSendToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(`You are not logged in! Please log in to get access.`, 401)
    );
  }
  // 2) Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exists.",
        401
      )
    );
  }
  // 4) Check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  next();
});

exports.communityLogin = catchAsync(async (req, res, next) => {
  // console.log(req.user.id);
  // console.log(req.params.id);

  createSendTokenForCommunityLogin(req.user.id, req.params.id, 200, req, res);
});

exports.protectCommunity = catchAsync(async (req, res, next) => {
  console.log("I reached here");
  console.log(req.user);
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(
        `You are not logged in your community! Please select your community.`,
        401
      )
    );
  }

  // 2) Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  const freshUser = await User.findById(decoded.userId);
  const freshCommunity = await Community.findById(decoded.communityId);
  console.log(freshCommunity);
  req.user = freshUser;
  req.community = freshCommunity;
  console.log(req.community);
  next();
});

exports.salesSignup = catchAsync(async (req, res, next) => {
  const newSalesPerson = await SalesDepartment.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    salesPersonId: req.body.salesPersonId,
    employeeSince: Date.now(),
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendTokenForSalesLogin(newSalesPerson, 201, req, res);
});

exports.salesLogin = catchAsync(async (req, res, next) => {
  const { salesPersonId, password } = req.body;

  // 1) Check if salesPersonId and password exist
  if (!salesPersonId || !password) {
    return next(new AppError("Please provide salesPersonId and password", 400));
  }

  // 2) Check if salesPerson exists && password is correct
  const salesPerson = await SalesDepartment.findOne({
    salesPersonId: salesPersonId,
  }).select("+password");

  if (
    !salesPerson ||
    !(await salesPerson.correctPassword(password, salesPerson.password))
  ) {
    return next(new AppError("Incorrect salesPersonId and password", 401));
  }

  // 3) If everything is ok, send json web token to client
  createSendTokenForSalesLogin(salesPerson, 200, req, res);
});

exports.salesProtect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(
        `You are not logged in your sales Management portal! Please try again after logging in.`,
        401
      )
    );
  }

  // 2) Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const salesPersonId = decoded.salesPersonId;
  const freshSalesPerson = await SalesDepartment.findOne({
    salesPersonId: salesPersonId,
  });
  req.salesPerson = freshSalesPerson;
  next();
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.oldPass, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  user.password = req.body.newPass;
  user.passwordConfirm = req.body.confirmPass;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});
