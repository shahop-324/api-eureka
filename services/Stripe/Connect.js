const catchAsync = require("../../utils/catchAsync");
const Community = require("./../../models/communityModel");
const Event = require("./../../models/eventModel");
const Ticket = require("./../../models/ticketModel");
const Coupon = require("./../../models/couponModel");
const User = require("./../../models/userModel");
const { v4: uuidv4 } = require("uuid");

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
  ticket
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
          } ,Price:${paymentEntity.amount},Date and time of booking:${new Date(
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
              { communityId: paymentEntity.notes.communityId },
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
                    } , Ticket name: ${ticket.name} ,Price:${
                      paymentEntity.amount
                    },Date and time of booking:${Date.now()} `,
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
      customer_email: "shreyanshshah242@gmail.com",
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
            "https://img.freepik.com/free-vector/music-event-poster-template-with-abstract-shapes_1361-1316.jpg?size=626&ext=jpg",
          ],
        },
      ],
      payment_intent_data: {
        application_fee_amount: 123,
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
  // Fullfill event ticket purchase requirements

  // Webhook endpoint secret => whsec_86wu3hYEByGQOAfJJftHj0pnUjzFzxst

  const endpointSecret = "whsec_86wu3hYEByGQOAfJJftHj0pnUjzFzxst";

  const sig = req.headers["stripe-signature"];

  let event;

  // Verify webhook signature and extract the event.
  // See https://stripe.com/docs/webhooks/signatures for more information.

  console.log(req);
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const webhookEventId = event.id; // This is the webhook event Id which can be used to fetch transaction data anytime.
    const sessionId = session.id; // This is the session Id which will be used to send invoices and issue refund (application fees will also be refunded) (cs_live........)
    const connectedAccountId = event.account; // This is the account Id of connected account
    const createdAt = event.created; // This is the time stamp of this purchase
    const amountSubtotal = session.amount_subtotal; // This is the sub total amount of this purchase (before including taxes, shipping charge and excluding discount)
    const amountTotal = session.amount_total; // This is the purchase total (after including taxes, shipping charge and excluding discount)
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

    const community = await Community.findById(communityId);
    const hapikey = community.hubspotApiKey;

    const salesForceAccount = await SalesForce.findOne({
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
      salesForceRegistrationCapture(salesForceAccount, user, event, ticket);
    }

    ////////////////////////////////
    // Fullfill the purchase
  } else {
    console.log("It's not what we are looking for, we will just let it pass.");
  }

  res.status(200).json({
    status: "success",
  });
});
