const mongoose = require("mongoose");
const catchAsync = require("../../utils/catchAsync");
const Community = require("./../../models/communityModel");
const Event = require("./../../models/eventModel");
const Ticket = require("./../../models/ticketModel");
const Coupon = require("./../../models/couponModel");
const EventTransaction = require("./../../models/eventTransactionModel");
const User = require("./../../models/userModel");
const SalesForce = require("../../models/salesForceModel");
const MailChimp = require("../../models/mailChimpModel");

const hash = require("hash-converter");
const { v4: uuidv4 } = require("uuid");
const Registration = require("./../../models/registrationsModel");
const EventTransactionIdsCommunityWise = require("../../models/eventTransactionIdsCommunityWise");
const RegistrationsIdsCommunityWise = require("../../models/registrationsIdsCommunityWiseModel");
const EventRegistrationTemplate = require("./../email/eventRegistrationMail")

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_KEY);

const stripe = require("stripe")(
  "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"
);

const hubspotRegistrationCapture = (
  hapikey,
  firstName,
  lastName,
  email,
  company
) => {
  console.log("Entered in hubspot integration function.");
  var options = {
    method: "POST",
    url: "https://api.hubapi.com/contacts/v1/contact/",
    qs: { hapikey: hapikey },
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      properties: [
        { property: "email", value: email },
        { property: "firstname", value: firstName },
        { property: "lastname", value: lastName },

        { property: "company", value: company },
        // { property: "hs_lead_status", value: "Connected" },
        { property: "lifecyclestage", value: "subscriber" },
      ],
    },
    json: true,
  };

  request(options, function (error, response, body) {
    if (error) return new appError(error, 401);
  });
};
const salesForceRegistrationCapture = async (
  salesForceAccount,
  user,
  event,
  ticket,
  amountTotal
) => {
  try {
    const res = await fetch(
      `${salesForceAccount.instanceUrl}/services/apexrest/CreateContact/`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${salesForceAccount.accessToken}`,
        },

        body: JSON.stringify({
          FirstName: user.firstName,
          LastName: user.lastName,
          Email: user.email,
          Description: `Event name: ${event.eventName} , Ticket name: ${
            ticket.name
          } ,Price:${amountTotal},Date and time of booking:${new Date(
            Date.now()
          )} `,
        }),
      }
    );

    if (!res.ok) {
      if (res.status === 401) {
        console.log("unauthorizied access token is expired");

        try {
          const res = await axios.post(
            `https://login.salesforce.com/services/oauth2/token?refresh_token=${salesForceAccount.refreshToken}&grant_type=refresh_token&client_id=${process.env.SALESFORCE_CLIENT_ID}&client_secret=${process.env.SALESFORCE_CLIENT_SECRET_ID}&redirect_uri=${process.env.SALESFORCE_REDIRECT_URI}`
          );

          const access_token = res.data.access_token;
          const instance_url = res.data.instance_url;

          // Update salesforce access token
          let SalesforceDoc;

          try {
            SalesforceDoc = await SalesForce.findOneAndUpdate(
              { communityId: salesForceAccount.communityId },
              { accessToken: access_token },
              { new: true, validateModifiedOnly: true }
            );

            try {
              console.log(instance_url);
              const res = await fetch(
                `${res.data.instance_url}/services/apexrest/CreateContact/`,
                {
                  method: "POST",

                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                  },

                  body: JSON.stringify({
                    FirstName: user.firstName,
                    LastName: user.lastName,
                    Email: paymentEntity.email,
                    Description: `Event name: ${
                      event.eventName
                    } , Ticket name: ${
                      ticket.name
                    } ,Price:${amountTotal},Date and time of booking:${new Date(
                      Date.now()
                    )} `,
                  }),
                }
              );

              if (!res.ok) {
                throw new Error("Something went wrong");
              }

              const parsedRes = await res.json();
              console.log(parsedRes, "This is new salesforce record");
            } catch (error) {
              console.log(error);
            }
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log(res);
        throw new Error(res.message);
      }
    }
    const result = await res.json();
  } catch (err) {
    console.log(err);
  }
};

const mailChimpRegistrationCapture = catchAsync(
  async (mailChimpAccount, event, mailChimpFormValues) => {
    // https://us5.api.mailchimp.com/3.0/lists/1e96addd9e/members/e0894719c49cc9d0abfa09b90ca62960

    const md5 = hash.MD5(mailChimpFormValues.email);
    const res = await fetch(
      `${mailChimpAccount.apiEndPoint}/3.0/lists/${event.mailChimpAudienceListIdForRegistrants}/members/${md5}`,
      {
        method: "PUT",
        body: JSON.stringify({
          ...formValues,
        }),

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mailChimpAccount.accessToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("something went wrong");
    }

    const result = await res.json();

    console.log(result);
  }
);
exports.initiateConnectedAccount = catchAsync(async (req, res, next) => {
  const communityId = req.community.id;

  const communityDoc = await Community.findById(communityId);

  const connectedStripeAccountId = communityDoc.communityDoc;

  if (connectedStripeAccountId) {
    // Stripe connect account id is already generated
    req.accountId = connectedStripeAccountId;
  } else {
    // No previous stripe connect account Id
    const account = await stripe.accounts.create({
      type: "standard",
    });

    const updatedCommunity = await Community.findByIdAndUpdate(
      communityId,
      { connectedStripeAccountId: account.id },
      { new: true, validateModifiedOnly: true }
    );

    // Pass accountId to next middleware function
    req.accountId = account.id;
  }
  next();
});

exports.getConnectLink = catchAsync(async (req, res, next) => {
  const return_url = req.body.return_url;
  const refresh_url = req.body.refresh_url;
  const accountId = req.accountId;

  const accountLinks = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${refresh_url}${accountId}`,
    return_url: `${return_url}${accountId}`,
    type: "account_onboarding",
  });

  res.status(200).json({
    status: "success",
    message: "successfully created stripe standard onboarding link.",
    links: accountLinks,
  });
});

exports.generatePaymentIntent = catchAsync(async (req, res, next) => {
  const communityId = req.body.communityId;
  const eventId = req.body.eventId;
  const userId = req.body.userId;
  const ticketId = req.body.ticketId;
  const couponId = req.body.couponId;

  const communityDoc = await Community.findById(communityId);
  const connectedStripeAccountId = communityDoc.communityDoc;

  const paymentIntent = await stripe.paymentIntents.create(
    {
      payment_method_types: ["card"],
      amount: 1000,
      currency: "inr",
      application_fee_amount: 123,
    },
    {
      stripeAccount: connectedStripeAccountId,
    }
  );
});

exports.getStripeConnectStatus = catchAsync(async (req, res, next) => {
  const communityId = req.params.communityId;
  const accountId = req.params.accountId;
  console.log(communityId, accountId);

  const communityDoc = await Community.findById(communityId);

  const connectedStripeAccountId = communityDoc.connectedStripeAccountId;

  const account = await stripe.accounts.retrieve(connectedStripeAccountId);

  const charges_enabled = account.charges_enabled;
  const details_submitted = account.details_submitted;

  if (charges_enabled && details_submitted) {
    await Community.findByIdAndUpdate(
      communityId,
      { verifiedStripeAccountId: account.id, isStripeEnabled: true },
      { new: true, validateModifiedOnly: true }
    );
  }

  res.status(200).json({
    status: "success",
    message: "successfully retrived connected account details.",
    account: account,
    charges_enabled: charges_enabled,
    details_submitted: details_submitted,
  });
});

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  const data = req.body;

  const userId = req.body.userId;
  const eventId = req.body.eventId;
  const ticketId = req.body.ticketId;
  const couponId = req.body.couponId;
  const communityId = req.body.communityId;

  const userDoc = await User.findById(userId);

  const userEmail = userDoc.email;

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

  console.log(data);

  const session = await stripe.checkout.sessions.create(
    {
      customer_email: userEmail,
      client_reference_id: uuidv4(),
      payment_method_types: ["card"],
      metadata: {
        userId: userId,
        ticketId: ticketId,
        eventId: eventId,
        couponId: couponId,
        communityId: communityId,
        registrationType: "Pre Event Sale",
      },
      line_items: [
        {
          name: "Test event stripe",
          amount: amountToBeCharged * 100,
          currency: "inr",
          quantity: 1,
          description: "Your are purchasing a ticket for Test event.",
          images: [
            "https://m.media-amazon.com/images/I/81SGb5l+lZL._AC_SL1500_.jpg",
          ],
        },
      ],
      // billing_address_collection: "required",
      payment_intent_data: {
        application_fee_amount: 123,
      },
      tax_id_collection: {
        enabled: true,
      },

      mode: "payment",
      success_url: "https://bluemeet.in",
      cancel_url: "https://bluemeet.in/privacy-policy",
    },
    {
      stripeAccount: "acct_1JdAqMSDXW2aFh0d",
    }
  );

  // 303 redirect to session.url

  res.status(200).json({
    session,
    status: "success",
  });
});

exports.eventTicketPurchased = catchAsync(async (req, res, next) => {
  const endpointSecret = "whsec_86wu3hYEByGQOAfJJftHj0pnUjzFzxst";

  const sig = req.headers["stripe-signature"];

  let event;

<<<<<<< HEAD
  // Verify webhook signature and extract the event.
  // See https://stripe.com/docs/webhooks/signatures for more information.

  console.log(req);
=======
>>>>>>> 08b9127 (commit)
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
<<<<<<< HEAD

    const webhookEventId = event.id; // This is the webhook event Id which can be used to fetch transaction data anytime.
=======
    // const connectedAccountId = event.account;

>>>>>>> 08b9127 (commit)
    const sessionId = session.id; // This is the session Id which will be used to send invoices and issue refund (application fees will also be refunded) (cs_live........)
    const connectedAccountId = event.account; // This is the account Id of connected account
    const createdAt = event.created; // This is the time stamp of this purchase
    const amountSubtotal = session.amount_subtotal; // This is the sub total amount of this purchase (before including taxes, shipping charge and excluding discount)
    const amountTotal = session.amount_total; // This is the purchase total (after including taxes, shipping charge and excluding discount)
<<<<<<< HEAD
    const clientReferenceId = event.data.client_reference_id; // This is the reference Id of this purchase which will refer to total things purchased (like ticket, add-ons)
    const currency = event.data.currency; // Currency in which this transaction happened
    const customerId = event.data.customer; // Customer Id of this user for our platform in Stripe database
    const email = event.data.customer_details.email; // email of this customer
    const userId = event.metadata.userId; // user Id of this customer in bluemeet database
    const ticketId = event.metadata.ticketId; // ticket Id in bluemeet database
    const eventId = event.metadata.eventId; // event Id in bluemeet database
    const couponId = event.metadata.couponId; // coupon Id in bluemeet database
    const communityId = event.metadata.communityId; // community Id in bluemeet database
    const registrationType = event.metadata.registrationType; // Registration type [enum] => ["Live event", "VOD one time", "VOD Subscription"]
    const paymentIntentId = event.payment_intent; // Payment intent Id which can be used to fetch deep details of payment and issue refund
    const paymentStatus = event.payment.payment_status; // Payment status
    const shipping = event.shipping; // Shipping address
    const subscription = event.subscription; // Subscription details
    const amountDiscount = event.total_details.amount_discount; // Discount that is offered on this purchase and excluded from amount_total
    const amountShipping = event.total_details.amount_shipping; // Shipping charge that is included in amount_total
    const amount_tax = event.total_details.amount_tax; // Tax amount that has been collected included in amount_total

    console.log(
      sessionId,
      connectedAccountId,
      createdAt,
      amountSubtotal,
      amountTotal,
      clientReferenceId,
      currency,
      customerId,
      email,
      userId,
      ticketId,
      eventId,
      couponId,
      communityId,
      registrationType,
      paymentIntentId,
      paymentStatus,
      shipping,
      subscription,
      amountDiscount,
      amountShipping,
      amount_tax
    );

    ////////////////////////////////////
=======
    const clientReferenceId = session.client_reference_id; // This is the reference Id of this purchase which will refer to total things purchased (like ticket, add-ons)
    const currency = session.currency; // Currency in which this transaction happened
    const customerId = session.customer; // Customer Id of this user for our platform in Stripe database
    const email = session.customer_details.email; // email of this customer
    const userId = session.metadata.userId; // user Id of this customer in bluemeet database
    const ticketId = session.metadata.ticketId; // ticket Id in bluemeet database
    const eventId = session.metadata.eventId; // event Id in bluemeet database
    const couponId = session.metadata.couponId; // coupon Id in bluemeet database
    const communityId = session.metadata.communityId; // community Id in bluemeet database
    const registrationType = session.metadata.registrationType; // Registration type [enum] => ["Live event", "VOD one time", "VOD Subscription"]
    const paymentIntentId = session.payment_intent; // Payment intent Id which can be used to fetch deep details of payment and issue refund
    const paymentStatus = session.payment_status; // Payment status
    const subscription = session.subscription; // Subscription details
    const amountDiscount = session.total_details.amount_discount; // Discount that is offered on this purchase and excluded from amount_total
    const amountShipping = session.total_details.amount_shipping; // Shipping charge that is included in amount_total
    const amount_tax = session.total_details.amount_tax; // Tax amount that has been collected included in amount_total

>>>>>>> 08b9127 (commit)

    const community = await Community.findById(communityId);
    const hapikey = community.hubspotApiKey;

    const salesForceAccount = await SalesForce.findOne({
      communityId: communityId,
    });
    const mailChimpAccount = await MailChimp.findOne({
      communityId: communityId,
    });
    const event = await Event.findById(eventId);
    const ticket = await Ticket.findById(ticketId);

    const user = await User.findById(userId);

    if (hapikey) {
      hubspotRegistrationCapture(
        hapikey,
        user.firstName,
        user.lastName,
        user.email,
        event.eventName
      );
    }
    if (salesForceAccount) {
      salesForceRegistrationCapture(
        salesForceAccount,
        user,
        event,
        ticket,
        amountTotal
      );
    }

    if (mailChimpAccount) {
      const mailChimpFormValues = {};

      // {

      //   "email_address":"op.shah@bluemeet.in",
      //   "merge_fields":{ "FNAME":"dinesh",
      //       "LNAME":"shah",
      //         "ADDRESS": "EE 738",
      //           "PHONE": "8103032829"},

      //   "status":"subscribed",
      //   "tags":["Zapier test"]

      //   }
      mailChimpFormValues.email_address = user.email;
      mailChimpFormValues.merge_fields = {
        FNAME: user.firstName,
        LNAME: user.lastName,
      };
      mailChimpFormValues.status = "Subscribed";
      mailChimpFormValues.tags = event.eventName;
      mailChimpRegistrationCapture(
        mailChimpAccount,
        event,
        mailChimpFormValues
      );
    }
    ////////////////////////////////
    // Fullfill the purchase

    try {
      // 1.) Created a New Event Transaction Doc and saved its reference in user, event and community documents.
      const newlyCreatedEventTransaction = await EventTransaction.create({
        transactionEntity: session,
        amount_charged: amountTotal,
        currency: currency,
        // order_id: paymentEntity.order_id,
        // transaction_id: paymentEntity.id,
        created_by_email: email,
        // created_by_phone: paymentEntity.contact,
        status: paymentStatus,
        created_at: Date.now(),
      });

      const communityGettingEventTransaction = await Community.findById(
        communityId
      );

      const userDoingEventTransaction = await User.findById(userId);

      const eventGettingEventTransaction = await Event.findById(eventId);

      const ticketBeingPurchased = await Ticket.findById(ticketId);

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
        ticketType: ticketBeingPurchased.name,

        eventTransactionId: newlyCreatedEventTransaction._id,
        ticketId: ticketId._id,
        totalAmountPaid: amountTotal,
        currency: currency,
        paymentStatus: paymentStatus,
        bookedByUser: userId,
        bookedForEventId: eventId,
        eventByCommunityId: communityId,
        appliedCouponId: couponId ? couponId : "No Coupon Id Found",
        createdAt: Date.now(),
        accessibleVenueAreas: ticketBeingPurchased.venueAreasAccessible,
        recordingWillBeShared: ticketBeingPurchased.shareRecording,
      });

      // 3.) Update corresponding user document

      userDoingEventTransaction.registeredInEvents.push(eventId);
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

      await communityRegistrationIdsDoc.save({
        new: true,
        validateModifiedOnly: true,
      });

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
        communityGettingEventTransaction.analytics.totalRevenue + amountTotal;

      communityGettingEventTransaction.analytics.revenuePreviousMonth =
        communityGettingEventTransaction.analytics.revenuePreviousMonth +
        amountTotal;

      communityGettingEventTransaction.analytics.revenueThisMonth =
        communityGettingEventTransaction.analytics.revenueThisMonth +
        amountTotal;

      communityGettingEventTransaction.analytics.revenuePreviousDay =
        communityGettingEventTransaction.analytics.revenuePreviousDay +
        amountTotal;

      communityGettingEventTransaction.analytics.revenueThisDay =
        communityGettingEventTransaction.analytics.revenueThisDay + amountTotal;

      communityGettingEventTransaction.analytics.revenuePreviousYear =
        communityGettingEventTransaction.analytics.revenuePreviousYear +
        amountTotal;

      communityGettingEventTransaction.analytics.revenueThisYear =
        communityGettingEventTransaction.analytics.revenueThisYear +
        amountTotal;

      communityGettingEventTransaction.analytics.revenuePreviousWeek =
        communityGettingEventTransaction.analytics.revenuePreviousWeek +
        amountTotal;

      communityGettingEventTransaction.analytics.revenueThisWeek =
        communityGettingEventTransaction.analytics.revenueThisWeek +
        amountTotal;

      communityGettingEventTransaction.analytics.revenueYesterday =
        communityGettingEventTransaction.analytics.revenueYesterday +
        amountTotal;

      communityGettingEventTransaction.analytics.revenueToday =
        communityGettingEventTransaction.analytics.revenueToday + amountTotal;

      // 6.) Update Corresponding Ticket document

      ticketBeingPurchased.numberOfTicketSold =
        ticketBeingPurchased.numberOfTicketSold + 1;

      ticketBeingPurchased.ticketIsSoldOut =
        ticketBeingPurchased.numberOfTicketSold ===
        ticketBeingPurchased.numberOfTicketAvailable
          ? true
          : false;

      // 7.) update Corresponding Coupon document (if applicable)
      if (couponId) {
        const coupondDocBeingUsed = await Coupon.findById(couponId);

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
        new: true,
        validateModifiedOnly: true,
      });

      await userDoingEventTransaction.save({
        new: true,
        validateModifiedOnly: true,
      });
      await eventGettingEventTransaction.save({
        new: true,
        validateModifiedOnly: true,
      });
      await ticketBeingPurchased.save({
        new: true,
        validateModifiedOnly: true,
      });

      // DONE VVIP Adding revenue in community account

      const msg = {
        to: email, // Change to your recipient
        from: "shreyanshshah242@gmail.com", // Change to your verified sender
        subject: "Your Event Registration Confirmation.",
        text: "You have just successfully registered in an event. Checkout your evenz user dashboard for more information. Thanks! ",
        html: EventRegistrationTemplate(
          `${userDoingEventTransaction.firstName}  ${userDoingEventTransaction.lastName}`,
          eventGettingEventTransaction.eventName,
          ticketBeingPurchased.name,
          amountTotal
        ),
      };

      sgMail
        .send(msg)
        .then(() => {
          console.log("Event Registraion email sent to user");
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("It's not what we are looking for, we will just let it pass.");
  }

  res.status(200).json({
    status: "success",
  });
});
