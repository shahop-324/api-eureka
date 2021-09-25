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
    const connectedAccountId = event.account;

    // console.log(session, "Ticket purchase succeded");

    const sessionId = session.id; // This is the session Id which will be used to send invoices and issue refund (application fees will also be refunded)
    const connectedAccountId = session.account; // This is the account Id of connected account
    const createdAt = session.created; // This is the time stamp of this purchase
    const amountSubtotal = session.amount_subtotal; // This is the sub total amount of this purchase (before including taxes, shipping charge and excluding discount)
    const amountTotal = session.amount_total; // This is the purchase total (after including taxes, shipping charge and excluding discount)
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
    const paymentStatus = session.payment.payment_status; // Payment status
    const shipping = session.shipping;
    const subscription = session.subscription;
    const amountDiscount = session.total_details.amount_discount; // Discount that is offered on this purchase and excluded from amount_total
    const amountShipping = session.total_details.amount_shipping; // Shipping charge that is included in amount_total
    const amount_tax = session.total_details.amount_tax; // Tax amount that has been collected included in amount_total

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

    // Fullfill the purchase
  } else {
    console.log("It's not what we are looking for, we will just let it pass.");
  }

  res.status(200).json({
    status: "success",
  });
});
