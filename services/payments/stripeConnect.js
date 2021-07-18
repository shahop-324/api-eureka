const catchAsync = require("../../utils/catchAsync");
const stripe = require("stripe")(
  "sk_test_51J5E00SEQWiD2nrd5zuBBjt9iPs8N0DgHi8ZnBx4o8zcGhdIZvGra8JYfeHlTxQX1LTYyjQ9fwPTIm4DCcIfqaV700CmFFXlCp"
);

exports.createStripeAccount = catchAsync(async (req, res, next) => {
//   const communityId = req.body.communityId;

  const account = await stripe.accounts.create({
    type: "custom",
    country: "US",
    email: "jenny.rosen@example.com",
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  const accountLinks = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: "http://localhost:3000/reauth",
    return_url: "http://localhost:3000/return",
    type: "account_onboarding",
  });

  res.status(200).json({
    status: "success",
    data: accountLinks,
  });
});
