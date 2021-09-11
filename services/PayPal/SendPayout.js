const catchAsync = require("../../utils/catchAsync");

exports.sendPayout = catchAsync(async(req, res, next) => {
    fetch(`https://api-m.sandbox.paypal.com/v1/payments/payouts`)
})