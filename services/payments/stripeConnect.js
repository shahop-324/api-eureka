const catchAsync = require("../../utils/catchAsync");
const Community = require("../../models/communityModel");
const User = require("../../models/userModel");
const Event = require("../../models/eventModel");
const Ticket = require("../../models/ticketModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createStripeAccount = catchAsync(async (req, res, next) => {
  const returnURL = req.body.return_url;
  const communityId = req.community.id;
  console.log("communityConnectingToStripe", communityId);

  const communityConnectingToStripe = await Community.findById(communityId);

  console.log(communityConnectingToStripe.stripeAccountId);

  let account = {};

  if (communityConnectingToStripe.stripeAccountId === undefined) {
    account = await stripe.accounts.create({
      type: "custom",
      country: "US",
      email: communityConnectingToStripe.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    communityConnectingToStripe.stripeAccountId = account.id;
    await communityConnectingToStripe.save({ validateModifiedOnly: true });
  } else {
    account.id = communityConnectingToStripe.stripeAccountId;
  }

  console.log(account.id);

  const accountLinks = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: "http://localhost:3000/reauth",
    return_url: returnURL,
    type: "account_onboarding",
  });

  res.status(200).json({
    status: "success",
    data: accountLinks,
  });
});

exports.getConnectedAccountStatus = catchAsync(async (req, res, next) => {
  const communityId = req.community.id;

  console.log(
    "Checking Stripe connect account status for community Id: ",
    communityId
  );

  const communityConnectingToStripe = await Community.findById(communityId);

  connectedAccountId = communityConnectingToStripe.stripeAccountId;

  const account = await stripe.accounts.retrieve(connectedAccountId);

  console.log(account);

  res.status(200).json({
    status: "success",
    charges_enabled: account.charges_enabled,
    payouts_enabled: account.payouts_enabled,
    details_submitted: account.details_submitted,
  });
});

exports.getEventRegistrationCheckoutSession = catchAsync(
  async (req, res, next) => {
    const userId = req.user.id;
    const eventId = req.body.eventId;
    const ticketId = req.body.ticketId;

    const userRegisteringForEvent = User.findById(userId);

    const eventGettingRegistration = Event.findById(eventId);

    const communityGettingRegistration = Community.findById(
      eventGettingRegistration.createdBy
    );

    const ticketBeingUtilised = Ticket.findById(ticketId);

    const priceToBeCharged = ticketBeingUtilised.price * 1 * 100;

    const applicationFeeAmount = priceToBeCharged * 0.03;

    const connectedStripeAccountId =
      communityGettingRegistration.stripeAccountId;

      console.log(connectedStripeAccountId);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          name: 'Checking Stripe checkout session',
          amount: 100000,
          currency: 'inr',
          quantity: 1,
        }],
        payment_intent_data: {
          application_fee_amount: 12300,
        },
        mode: 'payment',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
      }, {
        stripeAccount: 'acct_1JEznhGaMJl0MX6t',
      });

    res.status(200).json({
      status: "success",
      data: session,
    });

  }
);
