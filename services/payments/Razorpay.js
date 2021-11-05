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
      amount: 100,
      currency: "INR",
      receipt: UUID(),
      notes: {
        purpose: "add on",
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
        purpose: "community plan",
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

    const purpose = paymentEntity.notes.purpose;

    if (purpose === "community plan") {
      try {
        // Take that community and activate thier plan and tell them when their plan will end and how many registrations they can have.
        const registrations = paymentEntity.notes.registrations;
        const communityId = paymentEntity.notes.communityId;
        const userId = paymentEntity.notes.userId;
        const price = paymentEntity.amount;
        const currency = paymentEntity.currency;
        const planName = paymentEntity.notes.planName;
        const transactionId = paymentEntity.id;

        const userDoc = await User.findById(userId);

        // Here we need to add credits to super admin account and referrer account if this community's super admin was referred by someone and if this is this communities first ever upgrade

        const newCommunityTransaction = await CommunityTransaction.create({
          type: "Community Plan",
          planName: planName,
          purchasedBy: userDoc.firstName + " " + userDoc.lastName,
          price: (price * 1) / 100,
          currency: currency,
          date: Date.now(),
          transactionId: transactionId,
          communityId: communityId,
        });

        const communityDoc = await Community.findById(communityId);

        if (!communityDoc.upgradedForFirstTime) {
          // * This is this community's first ever upgrade

          // Apply credits to super admin if he/she is eligible

          const superAdminId = communityDoc.superAdmin;

          const superAdminDoc = await User.findById(superAdminId);

          const referredBy = superAdminDoc.referrer;

          if (referredBy) {
            // This person joined Bluemeet via referral

            const referredBydoc = await User.findById(referredBy);

            // Add USD 10 to both super admin and referrer and add 1 to upgrades of referrer

            superAdminDoc.credit = superAdminDoc.credit + 10;
            await superAdminDoc.save({ new: true, validateModifiedOnly: true });

            // Send mail to super admin informing about credits that were applied to their account
            const referralRedeemedMsg = {
              to: superAdminDoc.email, // Change to your recipient
              from: "shreyanshshah242@gmail.com", // Change to your verified sender
              subject: `$10 Bluemeet credits applied to your account.`,
              text: `We have applied your $10 referral credits to your account. Encourage others to switch to Bluemeet and earn $10 and give your referral $10 too. Its a win win for all of us. Cheers.`,
              // html: TeamInviteTemplate(urlToBeSent, communityDoc, userDoc),
            };

            sgMail
              .send(referralRedeemedMsg)
              .then(async () => {
                console.log("Referral redeemed mail sent to super admin.");
              })
              .catch(async (error) => {
                console.log(
                  "Failed to send Referral redeemed mail to super admin."
                );
              });

            if (referredBydoc) {
              // Means referrer exists
              referredBydoc.credit = referredBydoc.credit + 10;
              referredBydoc.upgrades = referredBydoc.upgrades + 1;

              await referredBydoc.save({
                new: true,
                validateModifiedOnly: true,
              });

              // Send mail to referrer informing about credits that were applied to their account

              const creditsAppliedMsg = {
                to: referredBydoc.email, // Change to your recipient
                from: "shreyanshshah242@gmail.com", // Change to your verified sender
                subject: `$10 Bluemeet credits applied to your account.`,
                text: `Someone has just upgraded their Bluemeet plan by your referral. So we have added $10 to your Bluemeet account.`,
                // html: TeamInviteTemplate(urlToBeSent, communityDoc, userDoc),
              };

              sgMail
                .send(creditsAppliedMsg)
                .then(async () => {
                  console.log("Credits applied mail sent to referrer.");
                })
                .catch(async (error) => {
                  console.log(
                    "Failed to send credits applied mail to referrer."
                  );
                });
            }

            //
          }

          // Mark that this community has upgraded their account before
          communityDoc.upgradedForFirstTime = true; // This is a flag that this community has upgraded their account to premium before
        }

        communityDoc.planName = planName;
        communityDoc.planExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
        communityDoc.allowedRegistrationLimit = registrations * 1;
        communityDoc.isUsingFreePlan = false;
        communityDoc.planTransactions.push(newCommunityTransaction._id);
        communityDoc.downgradeToFreeOnNextCycle = false;

        await communityDoc.save({ new: true, validateModifiedOnly: true });

        // Send mail to super admin informing about plan switch on their community

        const planSwitchMsg = {
          to: communityDoc.superAdminEmail, // Change to your recipient
          from: "shreyanshshah242@gmail.com", // Change to your verified sender
          subject: `Your Bluemeet plan has been changed!`,
          text: `We have successfully processed your request to change your Bluemeet plan. Please visit your community dashboard to get more details.`,
          // html: TeamInviteTemplate(urlToBeSent, communityDoc, userDoc),
        };

        sgMail
          .send(planSwitchMsg)
          .then(async () => {
            console.log("Plan switched mail sent to Community Super admin.");
          })
          .catch(async (error) => {
            console.log(
              "Failed to send plan switched mail sent to Community Super admin."
            );
          });
      } catch (error) {
        console.log(error);
      }
    }
    if (purpose === "add on") {
      const addOnName = paymentEntity.notes.addOnName;

      const userId = paymentEntity.notes.userId;
      const communityId = paymentEntity.notes.communityId;
      const numOfRegistrations = paymentEntity.notes.numOfRegistrations;
      const cloudStorage = paymentEntity.notes.cloudStorage;
      const emailCredits = paymentEntity.notes.emailCredits;
      const streamingHours = paymentEntity.notes.streamingHours;
      const numOfOrganiserSeats = paymentEntity.notes.numOfOrganiserSeats;
      const price = paymentEntity.amount;
      const currency = paymentEntity.currency;
      const transactionId = paymentEntity.id;
      const userDoc = await User.findById(userId);
      const communityDoc = await Community.findByIdAndUpdate(communityId);

      switch (addOnName) {
        case "Registrations":
          // Process registration add on request

          const registrationTransaction = await CommunityTransaction.create({
            type: "Add on",
            planName: addOnName,
            purchasedBy: userDoc.firstName + " " + userDoc.lastName,
            price: (price * 1) / 100,
            currency: currency,
            date: Date.now(),
            transactionId: transactionId,
            communityId: communityId,
          });

          communityDoc.extraRegistrationsLimit =
            communityDoc.extraRegistrationsLimit + numOfRegistrations * 1;
          communityDoc.extraRegistrationsToBeExpiredAt =
            Date.now() + 60 * 24 * 60 * 60 * 1000;
          communityDoc.planTransactions = registrationTransaction._id;

          await communityDoc.save({ new: true, validateModifiedOnly: true });

          // Send mail to community superadmin and add on is processed completely.

          const registrationMsg = {
            to: communityDoc.superAdminEmail, // Change to your recipient
            from: "shreyanshshah242@gmail.com", // Change to your verified sender
            subject: `Registration add added to your ${communityDoc.name} community.`,
            text: `We have successfully processed your request to add ${
              numOfRegistrations * 1
            } extra registrations to your community. You can use this add on till 60 days from today. Thanks, From Bluemeet Team.`,
            // html: TeamInviteTemplate(urlToBeSent, communityDoc, userDoc),
          };

          sgMail
            .send(registrationMsg)
            .then(async () => {
              console.log("Confirmation mail sent to Community Super admin.");
            })
            .catch(async (error) => {
              console.log(
                "Failed to send confirmation mail Community Super admin."
              );
            });

          break;

        case "Organisers":
          // Process organiser add on request

          const organiserSeatTransaction = await CommunityTransaction.create({
            type: "Add on",
            planName: addOnName,
            purchasedBy: userDoc.firstName + " " + userDoc.lastName,
            price: (price * 1) / 100,
            currency: currency,
            date: Date.now(),
            transactionId: transactionId,
            communityId: communityId,
          });

          communityDoc.extraOrganiserLimit =
            communityDoc.extraOrganiserLimit + numOfOrganiserSeats * 1;
          communityDoc.extraOrganiserLimitToBeExpiredAt =
            Date.now() + 30 * 24 * 60 * 60 * 1000;
          communityDoc.planTransactions = organiserSeatTransaction._id;

          await communityDoc.save({ new: true, validateModifiedOnly: true });

          // Send mail to community superadmin and add on is processed completely.

          const organiserSeatMsg = {
            to: communityDoc.superAdminEmail, // Change to your recipient
            from: "shreyanshshah242@gmail.com", // Change to your verified sender
            subject: `Extra Organiser seats added to your ${communityDoc.name} community.`,
            text: `We have successfully processed your request to add ${
              numOfOrganiserSeats * 1
            } extra organsiser seats to your community. You can use this add on till 30 days from today. Thanks, From Bluemeet Team.`,
            // html: TeamInviteTemplate(urlToBeSent, communityDoc, userDoc),
          };

          sgMail
            .send(organiserSeatMsg)
            .then(async () => {
              console.log("Confirmation mail sent to Community Super admin.");
            })
            .catch(async (error) => {
              console.log(
                "Failed to send confirmation mail Community Super admin."
              );
            });

          break;

        case "Streaming hours":
          // Process extra streaming hours add on request

          const streamingHourTransaction = await CommunityTransaction.create({
            type: "Add on",
            planName: addOnName,
            purchasedBy: userDoc.firstName + " " + userDoc.lastName,
            price: (price * 1) / 100,
            currency: currency,
            date: Date.now(),
            transactionId: transactionId,
            communityId: communityId,
          });

          communityDoc.extraStreamingHours =
            communityDoc.extraStreamingHours + streamingHours * 1;
          communityDoc.extraStreamingHoursToBeExpiredAt =
            Date.now() + 60 * 24 * 60 * 60 * 1000;
          communityDoc.planTransactions = streamingHourTransaction._id;

          await communityDoc.save({ new: true, validateModifiedOnly: true });

          // Send mail to community superadmin and add on is processed completely.

          const streamingHourMsg = {
            to: communityDoc.superAdminEmail, // Change to your recipient
            from: "shreyanshshah242@gmail.com", // Change to your verified sender
            subject: `Extra Streaming hours added to your ${communityDoc.name} community.`,
            text: `We have successfully processed your request to add ${
              streamingHours * 1
            } extra streaming hours to your community. You can use this add on till 60 days from today. Thanks, From Bluemeet Team.`,
            // html: TeamInviteTemplate(urlToBeSent, communityDoc, userDoc),
          };

          sgMail
            .send(streamingHourMsg)
            .then(async () => {
              console.log("Confirmation mail sent to Community Super admin.");
            })
            .catch(async (error) => {
              console.log(
                "Failed to send confirmation mail Community Super admin."
              );
            });

          break;

        case "Email":
          // Process extra emails add on request

          const emailCreditsTransaction = await CommunityTransaction.create({
            type: "Add on",
            planName: addOnName,
            purchasedBy: userDoc.firstName + " " + userDoc.lastName,
            price: (price * 1) / 100,
            currency: currency,
            date: Date.now(),
            transactionId: transactionId,
            communityId: communityId,
          });

          communityDoc.extraEmailLimit =
            communityDoc.extraEmailLimit + emailCredits * 1;
          communityDoc.extraEmailLimitToBeExpiredAt =
            Date.now() + 60 * 24 * 60 * 60 * 1000;
          communityDoc.planTransactions = emailCreditsTransaction._id;

          await communityDoc.save({ new: true, validateModifiedOnly: true });

          // Send mail to community superadmin and add on is processed completely.

          const emailCreditsMsg = {
            to: communityDoc.superAdminEmail, // Change to your recipient
            from: "shreyanshshah242@gmail.com", // Change to your verified sender
            subject: `Extra Email credits added to your ${communityDoc.name} community.`,
            text: `We have successfully processed your request to add ${
              emailCredits * 1
            } extra email credits to your community. You can use this add on till 60 days from today. Thanks, From Bluemeet Team.`,
            // html: TeamInviteTemplate(urlToBeSent, communityDoc, userDoc),
          };

          sgMail
            .send(emailCreditsMsg)
            .then(async () => {
              console.log("Confirmation mail sent to Community Super admin.");
            })
            .catch(async (error) => {
              console.log(
                "Failed to send confirmation mail Community Super admin."
              );
            });

          break;

        case "Cloud storage":
          // Process extra cloud storage add on request

          const cloudStorageTransaction = await CommunityTransaction.create({
            type: "Add on",
            planName: addOnName,
            purchasedBy: userDoc.firstName + " " + userDoc.lastName,
            price: (price * 1) / 100,
            currency: currency,
            date: Date.now(),
            transactionId: transactionId,
            communityId: communityId,
          });

          communityDoc.extraCloudStorageLimit =
            communityDoc.extraCloudStorageLimit + cloudStorage * 1;
          communityDoc.extraCloudStorageLimitToBeExpiredAt =
            Date.now() + 60 * 24 * 60 * 60 * 1000;
          communityDoc.planTransactions = cloudStorageTransaction._id;

          await communityDoc.save({ new: true, validateModifiedOnly: true });

          // Send mail to community superadmin and add on is processed completely.

          const cloudStorageMsg = {
            to: communityDoc.superAdminEmail, // Change to your recipient
            from: "shreyanshshah242@gmail.com", // Change to your verified sender
            subject: `Extra Cloud storage added to your ${communityDoc.name} community.`,
            text: `We have successfully processed your request to add ${
              cloudStorage * 1
            } extra cloud storage to your community. You can use this add on till 30 days from today. Thanks, From Bluemeet Team.`,
            // html: TeamInviteTemplate(urlToBeSent, communityDoc, userDoc),
          };

          sgMail
            .send(cloudStorageMsg)
            .then(async () => {
              console.log("Confirmation mail sent to Community Super admin.");
            })
            .catch(async (error) => {
              console.log(
                "Failed to send confirmation mail Community Super admin."
              );
            });

          break;

        default:
          break;
      }
    }
  } else {
    // pass it
  }

  res.status(200).json({
    status: "success",
  });
});
