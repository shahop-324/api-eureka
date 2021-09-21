const Event = require("../models/eventModel");
const catchAsync = require("../utils/catchAsync");
const Booth = require("./../models/boothModel");
const mongoose = require("mongoose");
const apiFeatures = require("../utils/apiFeatures");
const validator = require("validator");

const fillSocialMediaHandler = (object, updatedUser) => {
  for (let key in object) {
    const value = object[key];
    // 2) Check if value is a url
    // 3) if yes then go to next step and fetch only userhandle and then use it to replace old value of key
    // 4) if no then directly use this key value pair and return
    // 5) finally return transformed object having social media keys and corresponding userHandles
    const bool = validator.isURL(value);
    if (bool) {
      // now I have to use regular expression
      switch (key) {
        case "facebook": {
          const regex = /(?<=com\/).+/;
          [newVal] = value.match(regex);
         
          updatedUser.socialMediaHandles.set(key, newVal);
          break;
        }
        case "instagram": {
          const regex = /(?<=com\/).+/;
          [newVal] = value.match(regex);
          updatedUser.socialMediaHandles.set(key, newVal);
          break;
        }
        case "twitter": {
          const regex = /(?<=com\/).+/;
          [newVal] = value.match(regex);
          updatedUser.socialMediaHandles.set(key, newVal);
          break;
        }
        case "linkedIn": {
          const regex = /(?<=\/in\/).+/;
          [newVal] = value.match(regex);
          updatedUser.socialMediaHandles.set(key, newVal);
          break;
        }
        case "website": {
          const regex = /(?<=www.).+/;
          [newVal] = value.match(regex);
          updatedUser.socialMediaHandles.set(key, newVal);
          break;
        }
      }
    } else {
      updatedUser.socialMediaHandles.set(key, value);
    }
  }
  return updatedUser;
};

exports.deleteBooth = catchAsync(async (req, res, next) => {
  const boothId = req.params.id;

  await Booth.findByIdAndUpdate(
    boothId,
    { status: "Deleted" },
    { new: true, validateModifiedOnly: true }
  );

  res.status(200).json({
    status: "success",
  });
});

exports.getAllBoothOfEvent = catchAsync(async (req, res, next) => {


  const query = Booth.find({
    eventId: mongoose.Types.ObjectId(req.params.eventId),
  });

  const features = new apiFeatures(query, req.query).textFilter().tagFilter();
  const booths = await features.query;


  res.status(200).json({
    status: "SUCCESS",
    data: booths,
  });
});

exports.getOneBoothDetails = catchAsync(async (req, res, next) => {
  const boothId = req.params.id;

  const booth = await Booth.findById(boothId);



  res.status(200).json({
    status: "success",
    data: booth,
  });
});

exports.updateBooth = catchAsync(async (req, res, next) => {

  const boothId = req.params.id;

  const updatedBooth = await Booth.findByIdAndUpdate(
    boothId,
    {
      name: req.body.name,
      emails: req.body.emails,
      tagline: req.body.tagline,
      description: req.body.description,
      tags: req.body.tags,
    },
    {
      new: true,
      validateModifiedOnly: true,
    }
  );

  const processedBoothObj = fillSocialMediaHandler(
    req.body.socialMediaHandles,
    updatedBooth
  );


  if (req.body.image) {
    processedBoothObj.image = req.body.image;
  }

  const doublyUpdatedBooth = await processedBoothObj.save({
    new: true,
    validateModifiedOnly: true,
  });


  res.status(200).json({
    status: "success",
    data: doublyUpdatedBooth,
  });
});

exports.deleteBooth = catchAsync(async (req, res, next) => {
  const boothId = req.params.id;

  const deletedBooth = await Booth.findByIdAndUpdate(
    boothId,
    { status: "Deleted" },
    { new: true, validateModifiedOnly: true }
  );

  const id = deletedBooth._id;

  res.status(200).json({
    status: "success",
    data: id,
  });
});
