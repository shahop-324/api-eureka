const DemoRequest = require("../models/demoRequestModel");
const NewsletterEmailList = require("../models/newsletterEmailListModel");
const catchAsync = require("../utils/catchAsync");

exports.createSubscription = catchAsync(async (req, res, next) => {
  const newMail = await NewsletterEmailList.create({
      email: req.body.email,
  });

  res.status(201).json({
    status: "success",
    data: newMail,
  });
});