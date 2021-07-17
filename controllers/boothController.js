const Event = require("../models/eventModel");
const catchAsync = require("../utils/catchAsync");
const Booth = require("./../models/boothModel");
const mongoose = require("mongoose");
const apiFeatures = require("../utils/apiFeatures");
const validator = require("validator");

const newObj = {};

const fillSocialMediaHandler = (object) => {
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
          newObj.facebook = newVal;
          break;
        }
        case "instagram": {
          const regex = /(?<=com\/).+/;
          [newVal] = value.match(regex);
          newObj.instagram = newVal;
          break;
        }
        case "twitter": {
          const regex = /(?<=com\/).+/;
          [newVal] = value.match(regex);
          newObj.twitter = newVal;
          break;
        }
        case "linkedIn": {
          const regex = /(?<=\/in\/).+/;
          [newVal] = value.match(regex);
          newObj.linkedIn = newVal;
          break;
        }
        case "website": {
          const regex = /(?<=www.).+/;
          [newVal] = value.match(regex);
          newObj.website = newVal;
          break;
        }
      }
    } else {
      newObj.set(key, value);
    }
  }
  return newObj;
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
  console.log(req.query, 72);

  const query = Booth.find({
    eventId: mongoose.Types.ObjectId(req.params.eventId),
  });

  const features = new apiFeatures(query, req.query).textFilter();
  const booths = await features.query;

  console.log(booths);
  res.status(200).json({
    status: "SUCCESS",
    data: booths,
  });
});

exports.getOneBoothDetails = catchAsync(async (req, res, next) => {
  const boothId = req.params.id;

  const booth = await Booth.findById(boothId);

  console.log(booth);

  res.status(200).json({
    status: "success",
    data: booth,
  });
});

exports.updateBooth = catchAsync(async (req, res, next) => {
  const boothId = req.params.id;

  const processedObj = fillSocialMediaHandler(req.body.socialMediaHandles);
  console.log("This is processedObj", processedObj);

  const updatedBooth = await Booth.findByIdAndUpdate(
    boothId,
    {
      name: req.body.name,
      emails: req.body.emails,
      tagline: req.body.tagline,
      description: req.body.description,
      // boothLogo: req.body.boothLogo,
      // boothPoster: req.body.boothPoster,
      socialMediaHandles: processedObj,
      tags: req.body.tags,
    },
    {
      new: true,
      validateModifiedOnly: true,
    }
  );

  console.log(updatedBooth);

  res.status(200).json({
    status: "success",
    data: updatedBooth,
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
