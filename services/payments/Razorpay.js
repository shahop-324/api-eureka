const Razorpay = require("razorpay");
const crypto = require("crypto");
const UUID = require("uuid/v4");
const catchAsync = require("../../utils/catchAsync");

const CommunityTransaction = require("./../../models/communityTransactionModel");
const hubspot = require("@hubspot/api-client");
const axios = require("axios");
const Ticket = require("../../models/ticketModel");
const Event = require("../../models/eventModel");
const Coupon = require("../../models/couponModel");
const EventOrder = require("../../models/eventOrder");
const EventTransaction = require("../../models/eventTransactionModel");

var request = require("request");
const Community = require("../../models/communityModel");

const User = require("../../models/userModel");
const EventTransactionIdsCommunityWise = require("../../models/eventTransactionIdsCommunityWise");
const Registration = require("../../models/registrationsModel");
const RegistrationsIdsCommunityWise = require("../../models/registrationsIdsCommunityWiseModel");
const { convert } = require("exchange-rates-api");
const EventRegistrationTemplate = require("../email/eventRegistrationMail");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_KEY);

const razorpay = new Razorpay({
  key_id: "rzp_live_bDVAURs4oXxSGi",
  key_secret: "TFitnOVh9eOIFK3qdZsfCLfQ",
});

exports.createAddOnOrder = catchAsync(async (req, res, next) => {
  const addOnName = req.body.addonName;
  const numOfRegistrations = req.body.numOfRegistrations;
  const numOfOrganiserSeats = req.body.numOfOrganiserSeats;
  const cloudStorage = req.body.cloudStorage;
  const emailCredits = req.body.emailCredits;
  const streamingHours = req.body.streamingHours;
  const price = req.body.price;
  const communityId = req.body.communityId;
  const userId = req.body.userId;

  console.log(price);

  let priceToBeCharged = Math.ceil(price * 100 * 1.03);

  const newOrder = razorpay.orders.create(
    {
      amount: priceToBeCharged,
      currency: "USD",
      receipt: UUID(),
      notes: {
        userId: userId,
        addOnName: addOnName,
        communityId: communityId,
        price: price,
        numOfRegistrations: numOfRegistrations,
        cloudStorage: cloudStorage,
        emailCredits: emailCredits,
        streamingHours: streamingHours,
        numOfOrganiserSeats: numOfOrganiserSeats,
        transactionType: "addon",
      },
    },
    async (error, order) => {
      if (error) {
        console.log(error);
        res.status(400).json({
          status: "error",
        });
      } else {
        res.status(200).json({
          status: "success",
          data: order,
        });
      }
    }
  );

  // addonName: "Registrations",
  //       numOfRegistrations: value,
  //       price: value * 1,
  //       communityId: communityDetails._id,
  //       userId: userDetails._id,
});

exports.createOrderForCommunityPlan = catchAsync(async (req, res, next) => {
  const planName = req.body.planName;
  const price = req.body.price;
  const registrations = req.body.registrations;
  const duration = req.body.duration;
  const communityId = req.body.communityId;
  const userId = req.body.userId;

  let priceToBeCharged = Math.ceil(price * 100 * 1.03);

  if (duration === "yearly") {
    priceToBeCharged = priceToBeCharged;
  }

  const newOrder = razorpay.orders.create(
    {
      amount: 100,
      currency: "INR",
      receipt: UUID(),
      notes: {
        userId: userId,
        planName: planName,
        communityId: communityId,
        price: price,
        duration: duration,
        registrations: registrations,
        transactionType: "community plan purchase",
      },
    },
    async (error, order) => {
      if (error) {
        console.log(error);
        res.status(400).json({
          status: "error",
        });
      } else {
        res.status(200).json({
          status: "success",
          data: order,
        });
      }
    }
  );
});

exports.listenForSuccessfulRegistration = catchAsync(async (req, res, next) => {
  const secret = "sbvhqi839pqp’;a;s;sbuhwuhbhauxwvcywg3638228282fhvhyw";

  const paymentEntity = req.body.payload.payment.entity;

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    // This is a legit community plan purchase so process it.
    console.log(req.body.payload.payment.entity);

    try {
      // Take that community and activate thier plan and tell them when their plan will end and how many registrations they can have.
      const registrations = paymentEntity.notes.registrations;
      const communityId = paymentEntity.notes.communityId;
      const userId = paymentEntity.notes.userId;
      const price = paymentEntity.amount;
      const currency = paymentEntity.currency;
      const planName = paymentEntity.notes.planName;
      const timestamp = paymentEntity.created_at;
      const transactionId = paymentEntity.id;

      const userDoc = await User.findById(userId);

      const newCommunityTransaction = await CommunityTransaction.create({
        planName: planName,
        purchasedBy: userDoc.firstName + " " + userDoc.lastName,
        price: (price * 1) / 100,
        currency: currency,
        date: timestamp,
        transactionId: transactionId,
      });

      const communityDoc = await Community.findById(communityId);
      communityDoc.planName = planName;
      communityDoc.planExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
      communityDoc.allowedRegistrationLimit = registrations * 1;
      communityDoc.isUsingFreePlan = false;
      communityDoc.planTransactions.push(newCommunityTransaction._id);

      await communityDoc.save({ new: true, validateModifiedOnly: true });
    } catch (error) {
      console.log(error);
    }
  } else {
    // pass it
  }

  res.status(200).json({
    status: "success",
  });
});
