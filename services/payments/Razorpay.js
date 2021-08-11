const Razorpay = require("razorpay");
const crypto = require("crypto");
const UUID = require("uuid/v4");
const catchAsync = require("../../utils/catchAsync");
const Ticket = require("../../models/ticketModel");
const Event = require("../../models/eventModel");
const Coupon = require("../../models/couponModel");
const EventOrder = require("../../models/eventOrder");
const EventTransaction = require("../../models/eventTransactionModel");
const Community = require("../../models/communityModel");
const User = require("../../models/userModel");
const EventTransactionIdsCommunityWise = require("../../models/eventTransactionIdsCommunityWise");
const Registration = require("../../models/registrationsModel");
const RegistrationsIdsCommunityWise = require("../../models/registrationsIdsCommunityWiseModel");
const { convert } = require("exchange-rates-api");

const razorpay = new Razorpay({
  key_id: "rzp_live_bDVAURs4oXxSGi",
  key_secret: "TFitnOVh9eOIFK3qdZsfCLfQ",
});

exports.createRazorpayOrder = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const eventId = req.body.eventId;
  const ticketId = req.body.ticketId;
  const couponId = req.body.couponId;
  const communityId = req.body.communityId;

  const EventDoc = await Event.findById(eventId);
  const ticketBeingUsed = await Ticket.findById(ticketId);
  let originalTicketPrice = ticketBeingUsed.price * 1;
  let discountToBeApplied = 0;
  let amountToBeCharged;

  if (couponId) {
    const couponToBeApplied = await Coupon.findById(couponId);

    discountToBeApplied = couponToBeApplied
      ? couponToBeApplied.discountPercentage * 1
      : 0;
  }

  amountToBeCharged =
    originalTicketPrice - (originalTicketPrice / 100) * discountToBeApplied; // in INR (in paise not Rupee)

  const newOrder = razorpay.orders.create(
    {
      amount: amountToBeCharged * 100,
      currency: "INR",
      receipt: UUID(),
      notes: {
        userId: userId,
        ticketId: ticketId,
        eventId: eventId,
        couponId: couponId,
        communityId: communityId,
        registrationType: "Pre Event Sale",
      },
    },
    async (err, order) => {
      console.log("userId", userId);
      console.log("ticketId", ticketId);
      console.log("eventId", eventId);
      console.log("couponId", couponId);
      console.log("communityId", communityId);

      const newEventOrder = await EventOrder.create({
        eventOrderEntity: order,
        order_id: order.id,
        created_by: userId,
        created_for_event: eventId,
        created_for_community: communityId,
        created_for_ticket: ticketId,
        created_at: Date.now(),
      });

      res.status(200).json({
        status: "success",
        data: order,
      });
    }
  );
});



exports.createOrderForCommunityPlan = catchAsync(async(req, res, next) => {
  const planDetails = req.body.planDetails;
  const planName = req.body.planName;

  const communityId = req.body.communityId;

  const userId = req.body.userId;

let priceToBeCharged = 0;

  if(planName === "Basic") {
    priceToBeCharged = 0;
  }
  else if(planName === "Starter") {
    priceToBeCharged = 49 * 75 * 100 * 1.025; // In INR (paise)
  }
  else if(planName === "Professional") {
    priceToBeCharged = 99 * 75 *100 * 1.025 // In INR (paise)
  }

  const newOrder = razorpay.orders.create(
    {
      amount: priceToBeCharged,
      currency: "INR",
      receipt: UUID(),
      notes: {
        userId: userId,
        planName: planName,
        planDetails: planDetails,
        communityId: communityId,
        transactionType: "community plan purchase",
      },
    },
    async (err, order) => {
      console.log(err);
      // console.log("userId", userId);
      // console.log("ticketId", ticketId);
      // console.log("eventId", eventId);
      // console.log("couponId", couponId);
      // console.log("communityId", communityId);

      // const newEventOrder = await EventOrder.create({
      //   eventOrderEntity: order,
      //   order_id: order.id,
      //   created_by: userId,
      //   created_for_event: eventId,
      //   created_for_community: communityId,
      //   created_for_ticket: ticketId,
      //   created_at: Date.now(),
      // });

      res.status(200).json({
        status: "success",
        data: order,
      });
    }
  );



});


exports.createCommunityBillingPlanOrder = catchAsync(async (req, res, next) => {
  const communityId = req.community.id;
  const selectedPlanId = req.body.selectedPlanId;

  let amountToBeCharged = 0;

  switch (selectedPlanId) {
    case "PLAN_EVENZ_001Basics":
      amountToBeCharged = 99 * 75 * 100;
      break;
    case "PLAN_EVENZ_001Pro":
      amountToBeCharged = 599 * 75 * 100;
      break;
    case "PLAN_EVENZ_001Free":
      amountToBeCharged = 0 * 75 * 100;
      break;

    default:
      amountToBeCharged = 99 * 75 * 100;
  }

  const newOrder = razorpay.orders.create(
    {
      amount: amountToBeCharged,
      currency: "INR",
      receipt: UUID(),
      notes: {
        selectedPlanId: selectedPlanId,
        communityId: communityId,
      },
    },
    (err, order) => {
      // console.log("newOrder", newOrder);

      // Here Create New Community Plan order document
      // const newEventOrder = await EventOrder.create({
      //   eventOrderEntity: order,
      //   order_id: order.id,
      //   created_by: userId,
      //   created_for_event: eventId,
      //   created_for_community: communityId,
      //   created_for_ticket: ticketId,
      //   created_at: Date.now(),
      // });
      console.log(err);
      console.log(order);

      res.status(200).json({
        status: "success",
        data: order,
      });
    }
  );
});

exports.listenForSuccessfulRegistration = catchAsync(async (req, res, next) => {
  const secret = "sbvhqi839pqp’;a;s;sbuhwuhbhauxwvcywg3638228282fhvhyw";

  console.log(req.body.payload.payment.entity);

  const paymentEntity = req.body.payload.payment.entity;

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("Request is legit");

    console.log("userId", paymentEntity.notes.userId);
    console.log("ticketId", paymentEntity.notes.ticketId);
    console.log("eventId", paymentEntity.notes.eventId);
    console.log("couponId", paymentEntity.notes.couponId);
    console.log("communityId", paymentEntity.notes.communityId);
    console.log("razorpayFee", paymentEntity.fee);
    console.log("GST", paymentEntity.tax);
    console.log("Created By Mail", paymentEntity.email);
    console.log("Created By Contact", paymentEntity.contact);
    console.log("Amount Charged", paymentEntity.amount);
    console.log("Currency", paymentEntity.currency);
    console.log("Order Id", paymentEntity.order_id);
    console.log("Razorpay Pay Id", paymentEntity.id); // this is razorpay pay_id
    console.log("Transaction Status", paymentEntity.status);
    console.log("Transaction Description", paymentEntity.description);
    console.log("Transaction Created At", paymentEntity.created_at);

    let communityCredit = paymentEntity.amount * 0.95; // TODO Charge Based on Plan Here

    try {
      // 1.) Created a New Event Transaction Doc and saved its reference in user, event and community documents.

      const newlyCreatedEventTransaction = await EventTransaction.create({
        transactionEntity: paymentEntity,
        amount_charged: paymentEntity.amount,
        currency: paymentEntity.currency,
        order_id: paymentEntity.order_id,
        transaction_id: paymentEntity.id,
        created_by_email: paymentEntity.email,
        created_by_phone: paymentEntity.contact,
        status: paymentEntity.status,
        created_at: Date.now(),
      });

      const communityGettingEventTransaction = await Community.findById(
        paymentEntity.notes.communityId
      );

      const userDoingEventTransaction = await User.findById(
        paymentEntity.notes.userId
      );

      const eventGettingEventTransaction = await Event.findById(
        paymentEntity.notes.eventId
      );

      const ticketBeingPurchased = await Ticket.findById(
        paymentEntity.notes.ticketId
      );

      userDoingEventTransaction.eventTransactionIds.push(
        newlyCreatedEventTransaction._id
      );
      eventGettingEventTransaction.eventTransactionIds.push(
        newlyCreatedEventTransaction._id
      );

      const eventTransactionIdsDoc =
        await EventTransactionIdsCommunityWise.findById(
          communityGettingEventTransaction.eventTransactionDocIdCommunityWise
        );

      eventTransactionIdsDoc.eventTransactionIds.push(
        newlyCreatedEventTransaction._id
      );

      await eventTransactionIdsDoc.save({ validateModifiedOnly: true });

      // 2.) Create a Invoice / Registration Doc

      const newlyCreatedRegistration = await Registration.create({
        registrationType: "Pre Event Sale",
        eventName: eventGettingEventTransaction.eventName,
        userName: `${userDoingEventTransaction.firstName}  ${userDoingEventTransaction.lastName}`,
        userImage: userDoingEventTransaction.image,
        userEmail: userDoingEventTransaction.email,
        created_by_contact: paymentEntity.contact,
        ticketType: ticketBeingPurchased.name,
        paymentProcesserFee: paymentEntity.fee,
        paymentTax: paymentEntity.tax,
        eventTransactionId: newlyCreatedEventTransaction._id,
        ticketId: paymentEntity.notes.ticketId._id,
        totalAmountPaid: paymentEntity.amount,
        currency: paymentEntity.currency,
        orderId: paymentEntity.order_id,
        razorpayPayId: paymentEntity.id,
        paymentStatus: paymentEntity.status,
        paymentDescription: paymentEntity.description,
        bookedByUser: paymentEntity.notes.userId,
        bookedForEventId: paymentEntity.notes.eventId,
        eventByCommunityId: paymentEntity.notes.communityId,
        appliedCouponId: paymentEntity.notes.couponId
          ? paymentEntity.notes.couponId
          : "No Coupon Id Found",
        createdAt: Date.now(),
        accessibleVenueAreas: ticketBeingPurchased.venueAreasAccessible,
        recordingWillBeShared: ticketBeingPurchased.shareRecording,
      });

      // 3.) Update corresponding user document

      userDoingEventTransaction.registeredInEvents.push(
        paymentEntity.notes.eventId
      );
      userDoingEventTransaction.registrations.push(
        newlyCreatedRegistration._id
      );

      // 4.) Update Corresponding Event document
      eventGettingEventTransaction.registrations.push(
        newlyCreatedRegistration._id
      );
      eventGettingEventTransaction.registrationsRecieved =
        eventGettingEventTransaction.registrationsRecieved + 1;

      // 5.) Update Corresponding Community document
      const communityRegistrationIdsDoc =
        await RegistrationsIdsCommunityWise.findById(
          communityGettingEventTransaction.registrationsDocIdCommunityWise
        );
      communityRegistrationIdsDoc.registrationsId.push(
        newlyCreatedRegistration._id
      );

      await communityRegistrationIdsDoc.save({ validateModifiedOnly: true });

      communityGettingEventTransaction.analytics.totalRegistrations =
        communityGettingEventTransaction.analytics.totalRegistrations + 1;

      communityGettingEventTransaction.analytics.totalRegistrationsPreviousMonth =
        communityGettingEventTransaction.analytics
          .totalRegistrationsPreviousMonth + 1;

      communityGettingEventTransaction.analytics.totalRegistrationsThisMonth =
        communityGettingEventTransaction.analytics.totalRegistrationsThisMonth +
        1;

      communityGettingEventTransaction.analytics.totalRegistrationsPreviousDay =
        communityGettingEventTransaction.analytics
          .totalRegistrationsPreviousDay + 1;

      communityGettingEventTransaction.analytics.totalRegistrationsThisDay =
        communityGettingEventTransaction.analytics.totalRegistrationsThisDay +
        1;

      communityGettingEventTransaction.analytics.totalRegistrationsPreviousYear =
        communityGettingEventTransaction.analytics
          .totalRegistrationsPreviousYear + 1;

      communityGettingEventTransaction.analytics.totalRegistrationsThisYear =
        communityGettingEventTransaction.analytics.totalRegistrationsThisYear +
        1;

      communityGettingEventTransaction.analytics.totalRegistrationsPreviousWeek =
        communityGettingEventTransaction.analytics
          .totalRegistrationsPreviousWeek + 1;

      communityGettingEventTransaction.analytics.totalRegistrationsThisWeek =
        communityGettingEventTransaction.analytics.totalRegistrationsThisWeek +
        1;

      communityGettingEventTransaction.analytics.totalRegistrationsYesterday =
        communityGettingEventTransaction.analytics.totalRegistrationsYesterday +
        1;

      communityGettingEventTransaction.analytics.totalRegistrationsToday =
        communityGettingEventTransaction.analytics.totalRegistrationsToday + 1;

      communityGettingEventTransaction.analytics.totalRevenue =
        communityGettingEventTransaction.analytics.totalRevenue +
        communityCredit;

      communityGettingEventTransaction.analytics.revenuePreviousMonth =
        communityGettingEventTransaction.analytics.revenuePreviousMonth +
        communityCredit;

      communityGettingEventTransaction.analytics.revenueThisMonth =
        communityGettingEventTransaction.analytics.revenueThisMonth +
        communityCredit;

      communityGettingEventTransaction.analytics.revenuePreviousDay =
        communityGettingEventTransaction.analytics.revenuePreviousDay +
        communityCredit;

      communityGettingEventTransaction.analytics.revenueThisDay =
        communityGettingEventTransaction.analytics.revenueThisDay +
        communityCredit;

      communityGettingEventTransaction.analytics.revenuePreviousYear =
        communityGettingEventTransaction.analytics.revenuePreviousYear +
        communityCredit;

      communityGettingEventTransaction.analytics.revenueThisYear =
        communityGettingEventTransaction.analytics.revenueThisYear +
        communityCredit;

      communityGettingEventTransaction.analytics.revenuePreviousWeek =
        communityGettingEventTransaction.analytics.revenuePreviousWeek +
        communityCredit;

      communityGettingEventTransaction.analytics.revenueThisWeek =
        communityGettingEventTransaction.analytics.revenueThisWeek +
        communityCredit;

      communityGettingEventTransaction.analytics.revenueYesterday =
        communityGettingEventTransaction.analytics.revenueYesterday +
        communityCredit;

      communityGettingEventTransaction.analytics.revenueToday =
        communityGettingEventTransaction.analytics.revenueToday +
        communityCredit;

      // 6.) Update Corresponding Ticket document

      ticketBeingPurchased.numberOfTicketSold =
        ticketBeingPurchased.numberOfTicketSold + 1;

      ticketBeingPurchased.ticketIsSoldOut =
        ticketBeingPurchased.numberOfTicketSold ===
        ticketBeingPurchased.numberOfTicketAvailable
          ? true
          : false;

      // 7.) update Corresponding Coupon document (if applicable)
      if (paymentEntity.notes.couponId) {
        const coupondDocBeingUsed = await Coupon.findById(
          paymentEntity.notes.couponId
        );

        coupondDocBeingUsed.numOfCouponsUsed =
          coupondDocBeingUsed.numOfCouponsUsed + 1;

        coupondDocBeingUsed.status =
          coupondDocBeingUsed.maxNumOfDiscountPermitted ===
          coupondDocBeingUsed.numOfCouponsUsed
            ? "Inactive"
            : "Active";

        await coupondDocBeingUsed.save({ validateModifiedOnly: true });
      }

      // 8. ) Save all Modified documents to the database

      await communityGettingEventTransaction.save({
        validateModifiedOnly: true,
      });

      await userDoingEventTransaction.save({ validateModifiedOnly: true });
      await eventGettingEventTransaction.save({ validateModifiedOnly: true });
      await ticketBeingPurchased.save({ validateModifiedOnly: true });

      // TODO VVIP Add revenue in community account
    } catch (err) {
      console.log(err);
    }
  } else {
    // pass it
  }

  res.status(200).json({
    status: "success",
  });
});
