const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Community = require("../models/communityModel");
const MailList = require("../models/emailListModel");
const SalesDepartment = require("../models/salesDepartmentModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync");
const crypto = require("crypto");
const uniqid = require("uniqid");
const { nanoid } = require("nanoid");
const LoggedInUsers = require("../models/loggedInUsers");
const CommunityCredentials = require("../models/CommunityCredentialsModel");
const TeamInvite = require("../models/teamInviteModel");
const Registration = require("../models/registrationsModel");
const Speaker = require("./../models/speakerModel");
// this function will return you jwt token
const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

exports.signInForSpeaker = catchAsync(async (req, res, next) => {
  const speakerId = req.params.speakerId;
  const token = signToken(speakerId);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.loginMagicLinkUser = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  const userDoc = await User.findById(userId);

  const token = signToken(userId);

  res.status(200).json({
    status: "success",

    token,
    data: {
      user: userDoc,
    },
  });
});

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
  const communityDoc = await Community.findById(communityId);
  res.status(statusCode).json({
    status: "success",
    token,
    communityDoc,
  });
};

// this function is signup function for users

exports.signup = catchAsync(async (req, res) => {
  // Create new referral code
  const MyReferralCode = nanoid(10);

  // check if someone referred this new user

  let referrer;

  if (req.body.referralCode) {
    referrer = await User.findOneAndUpdate(
      { referralCode: req.body.referralCode },

      { $inc: { signupUsingReferral: 1 } },

      {
        new: true,
        validateModifiedOnly: true,
      }
    );

    if (referrer) {
      const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        initialisedAt: Date.now(),
        password: req.body.password,

        policySigned: req.body.policySigned,
        referralCode: MyReferralCode,
        referrer: referrer._id,
        signupUsingReferral: 0,
        upgrades: 0,
        credit: 0,
      });
      const name = `${req.body.firstName} ${req.body.lastName}`;
      await MailList.create({
        name: name,
        email: req.body.email,
      });
      await LoggedInUsers.create({
        userId: newUser._id,
      });

      // * Add this user to communities in which he / she is invited if there is any pending team invite on his email
      // * Register this user to events in which he /she is invited as speaker and invitations corresponding registration is still not cancelled or event is not over already
      // Remember there can be multiple invites as a speaker in multiple events from multiple communities
      // Remember there can be multiple invites in any category on an email

      const teamInvites = await TeamInvite.find({
        invitedUserEmail: req.body.email,
      });

      for (let element of teamInvites) {
        const status = element.status;

        const userEmail = element.invitedUserEmail;

        const communityId = element.communityId;

        const userDoc = newUser;

        const CommunityDoc = await Community.findById(communityId).populate(
          "eventManagers",
          "email"
        );

        // accept team invitaion

        // Push this persons userId in eventManagers array in community
        CommunityDoc.eventManagers.push(userDoc._id);
        await CommunityDoc.save({ new: true, validateModifiedOnly: true });

        // add this community in this users doc in invited communities array
        userDoc.invitedCommunities.push(communityId);
        await userDoc.save({ new: true, validateModifiedOnly: true });

        // Mark this invitation document status as accepted
        element.status = "Accepted";
        await element.save({ new: true, validateModifiedOnly: true });

        // TODO For every team invitation accepted please send a confirmation mail to user and community super admin

        // Team invitation accepted
      }

      // * DONE At this point we are sure that we have accepted all pending team invitations

      // Get all speaker registrations that are still pending and not cancelled for this users email

      const speakerRegistrations = await Registration.find({
        $and: [
          { type: "Speaker" },
          { status: "Pending" },
          { cancelled: false },
          { userEmail: req.body.email },
        ],
      });

      const speakers = await Speaker.find({ email: req.body.email });

      for (let element of speakers) {
        element.userId = userDoc._id;
        await element.save({ new: true, validateModifiedOnly: true });
      }

      // Now we have all speaker registrations for this user which are still pending and not cancelled

      for (let element of speakerRegistrations) {
        // For every registration add it to user registered events and push each registration into user document

        const userDoc = newUser;

        userDoc.registeredInEvents.push(element.bookedForEventId);
        userDoc.registrations.push(element._id);

        // update each registration as completed and fill details like user Id and other user details that are needed

        element.status = "Completed";
        element.userName = userDoc.firstName + " " + userDoc.lastName;
        element.userImage = userDoc.image;
        element.bookedByUser = userDoc._id;
        element.first_name = userDoc.firstName;
        element.lastName = userDoc.lastName;
        element.name = userDoc.firstName + " " + userDoc.lastName;
        element.organisation = userDoc.organisation;
        element.designation = userDoc.designation;
        element.city = userDoc.city;
        element.country = userDoc.country;

        // Save all updates in userDoc and registration doc.
        await userDoc.save({ new: true, validateModifiedOnly: true });
        await element.save({ new: true, validateModifiedOnly: true });

        // TODO For every speaker invitation accepted please send a confirmation mail to user

        // Speaker invitation accepted
      }

      // * DONE At this point we are sure that we have accepted all pending speaker invitations

      const boothRegistrations = await Registration.find({
        $and: [
          { type: "Exhibitor" },
          { status: "Pending" },
          { cancelled: false },
          { userEmail: req.body.email },
        ],
      });

      // Now we have all booth registrations for this user which are still pending and not cancelled

      for (let element of boothRegistrations) {
        // For every registration add it to user registered events and push each registration into user document

        const userDoc = newUser;

        userDoc.registeredInEvents.push(element.bookedForEventId);
        userDoc.registrations.push(element._id);

        // update each registration as completed and fill details like user Id and other user details that are needed

        element.status = "Completed";
        element.userName = userDoc.firstName + " " + userDoc.lastName;
        element.userImage = userDoc.image;
        element.bookedByUser = userDoc._id;
        element.first_name = userDoc.firstName;
        element.lastName = userDoc.lastName;
        element.name = userDoc.firstName + " " + userDoc.lastName;
        element.organisation = userDoc.organisation;
        element.designation = userDoc.designation;
        element.city = userDoc.city;
        element.country = userDoc.country;

        // Save all updates in userDoc and registration doc.
        await userDoc.save({ new: true, validateModifiedOnly: true });
        await element.save({ new: true, validateModifiedOnly: true });

        // TODO For every booth invitation accepted please send a confirmation mail to user

        // Booth invitation accepted
      }

      // * DONE At this point we are sure that we have accepted all pending booth invitations

      createSendToken(newUser, 201, req, res);
    }
  } else {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      initialisedAt: Date.now(),
      password: req.body.password,

      policySigned: req.body.policySigned,
      referralCode: MyReferralCode,

      signupUsingReferral: 0,
      upgrades: 0,
      credit: 0,
    });
    const name = `${req.body.firstName} ${req.body.lastName}`;
    await MailList.create({
      name: name,
      email: req.body.email,
    });
    await LoggedInUsers.create({
      userId: newUser._id,
    });

    // TODO Add this user to communities in which he / she is invited if there is any pending team invite on his email

    // * Add this user to communities in which he / she is invited if there is any pending team invite on his email
    // Remember there can be multiple invites in any category on an email

    const teamInvites = await TeamInvite.find({
      invitedUserEmail: req.body.email,
    });

    for (let element of teamInvites) {
      const status = element.status;

      const userEmail = element.invitedUserEmail;

      const communityId = element.communityId;

      const userDoc = newUser;

      const CommunityDoc = await Community.findById(communityId).populate(
        "eventManagers",
        "email"
      );

      // accept team invitaion

      // Push this persons userId in eventManagers array in community
      CommunityDoc.eventManagers.push(userDoc._id);
      await CommunityDoc.save({ new: true, validateModifiedOnly: true });

      // add this community in this users doc in invited communities array
      userDoc.invitedCommunities.push(communityId);
      await userDoc.save({ new: true, validateModifiedOnly: true });

      // Mark this invitation document status as accepted
      element.status = "Accepted";
      await element.save({ new: true, validateModifiedOnly: true });

      // TODO For every team invitation accepted please send a confirmation mail to user and community super admin

      // Team invitation accepted
    }

    // * At this point we are sure that we have accepted all pending team invitations

    // Get all speaker registrations that are still pending and not cancelled for this users email

    const speakerRegistrations = await Registration.find({
      $and: [
        { type: "Speaker" },
        { status: "Pending" },
        { cancelled: false },
        { userEmail: req.body.email },
      ],
    });

    // Now we have all speaker registrations for this user which are still pending and not cancelled

    for (let element of speakerRegistrations) {
      // For every registration add it to user registered events and push each registration into user document

      const userDoc = newUser;

      userDoc.registeredInEvents.push(element.bookedForEventId);
      userDoc.registrations.push(element._id);

      // update each registration as completed and fill details like user Id and other user details that are needed

      element.status = "Completed";
      element.userName = userDoc.firstName + " " + userDoc.lastName;
      element.userImage = userDoc.image;
      element.bookedByUser = userDoc._id;
      element.first_name = userDoc.firstName;
      element.lastName = userDoc.lastName;
      element.name = userDoc.firstName + " " + userDoc.lastName;
      element.organisation = userDoc.organisation;
      element.designation = userDoc.designation;
      element.city = userDoc.city;
      element.country = userDoc.country;

      // Save all updates in userDoc and registration doc.
      await userDoc.save({ new: true, validateModifiedOnly: true });
      await element.save({ new: true, validateModifiedOnly: true });

      // TODO For every speaker invitation accepted please send a confirmation mail to user

      // Speaker invitation accepted
    }

    // * DONE At this point we are sure that we have accepted all pending speaker invitations

    const boothRegistrations = await Registration.find({
      $and: [
        { type: "Exhibitor" },
        { status: "Pending" },
        { cancelled: false },
        { userEmail: req.body.email },
      ],
    });

    // Now we have all booth registrations for this user which are still pending and not cancelled

    for (let element of boothRegistrations) {
      // For every registration add it to user registered events and push each registration into user document

      const userDoc = newUser;

      userDoc.registeredInEvents.push(element.bookedForEventId);
      userDoc.registrations.push(element._id);

      // update each registration as completed and fill details like user Id and other user details that are needed

      element.status = "Completed";
      element.userName = userDoc.firstName + " " + userDoc.lastName;
      element.userImage = userDoc.image;
      element.bookedByUser = userDoc._id;
      element.first_name = userDoc.firstName;
      element.lastName = userDoc.lastName;
      element.name = userDoc.firstName + " " + userDoc.lastName;
      element.organisation = userDoc.organisation;
      element.designation = userDoc.designation;
      element.city = userDoc.city;
      element.country = userDoc.country;

      // Save all updates in userDoc and registration doc.
      await userDoc.save({ new: true, validateModifiedOnly: true });
      await element.save({ new: true, validateModifiedOnly: true });

      // TODO For every booth invitation accepted please send a confirmation mail to user

      // Booth invitation accepted
    }

    // * DONE At this point we are sure that we have accepted all pending booth invitations

    createSendToken(newUser, 201, req, res);
  }
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
  createSendTokenForCommunityLogin(req.user.id, req.params.id, 200, req, res);
});

exports.protectCommunity = catchAsync(async (req, res, next) => {
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

  const freshUser = await User.findById(decoded.userId);
  const freshCommunity = await Community.findById(decoded.communityId);

  req.user = freshUser;
  req.community = freshCommunity;

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

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, req, res);
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

exports.authenticateCommunity = catchAsync(async (req, res, next) => {
  const { apiKey, apiSecret } = req.query;

  console.log(apiKey);
  console.log(apiSecret);

  // 1) Check if apiKey and apiSecret Exist
  if (!apiKey || !apiSecret) {
    return next(new AppError("Please provide apiKey and apiSecret!", 400));
  }

  // 2) Check if community exists && credentials are correct
  const credentialDoc = await CommunityCredentials.findOne({
    APIKey: apiKey,
  }).select("+APISecret");

  if (
    !credentialDoc ||
    !(apiSecret.toString() === credentialDoc.APISecret.toString())
  ) {
    return next(new AppError("Incorrect api key or secret", 401));
  }

  const CommunityDoc = await Community.findById(credentialDoc.communityId);

  // 3) If everything ok, send pass on to next middleware
  res.status(200).json(CommunityDoc);
});
