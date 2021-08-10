const DemoRequest = require("../models/demoRequestModel");
const catchAsync = require("../utils/catchAsync");

exports.createDemoRequest = catchAsync(async (req, res, next) => {
  const demoRequestDoc = await DemoRequest.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    companyName: req.body.companyName,
    phoneNumber: req.body.phoneNumber,
    jobTitle: req.body.jobTitle,
    isEventAgency: req.body.isEventAgency,
    region: req.body.region,
  });

  res.status(201).json({
    status: "success",
    data: demoRequestDoc,
  });
});
