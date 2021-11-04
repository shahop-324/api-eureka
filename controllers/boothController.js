const Event = require("../models/eventModel");
const catchAsync = require("../utils/catchAsync");
const Community = require("./../models/communityModel");
const User = require("./../models/userModel");
const Booth = require("./../models/boothModel");
const Registration = require("./../models/registrationsModel");
const mongoose = require("mongoose");
const apiFeatures = require("../utils/apiFeatures");
const validator = require("validator");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

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

  const boothDoc = await Booth.findById(boothId);

  const eventId = boothDoc.eventId;

  const eventDoc = await Event.findById(eventId);

  // Unregister all registrations associated with this booth

  const registrations = await Registration.find({
    $and: [
      { boothId: mongoose.Types.ObjectId(boothId) },
      { type: "Exhibitor" },
    ],
  });

  for (let element of registrations) {
    await Registration.findByIdAndDelete(element);
  }

  // * DONE Remove all booth tags associated with this booth

  // Step 1.) get all booths of this event and collect thier unique tags

  let uniqueTags = [];

  for (element of eventDoc.booths) {
    if (!(element.toString() === boothId)) {
      const booth = await Booth.findById(element);

      for (let item of booth.tags) {
        if (!uniqueTags.includes(item)) {
          uniqueTags.push(item);
        }
      }
    }
  }

  // Step 2.) assign that array of unique tags to boothTags field of this event

  eventDoc.boothTags = uniqueTags;
  await eventDoc.save({ new: true, validateModifiedOnly: true });

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
  try {
    const boothId = req.params.id;

    const boothDoc = await Booth.findById(boothId);

    const eventId = boothDoc.eventId;

    const eventDoc = await Event.findById(eventId);

    const communityId = eventDoc.communityId;

    const communityDoc = await Community.findById(communityId);

    const emailsBeforeUpdate = boothDoc.emails;

    // Emails update

    if (req.body.emails) {
      // Check which emails are removed => delete their registrations for this event

      const removedEmails = emailsBeforeUpdate.filter((el) => !req.body.emails);

      for (let element of removedEmails) {
        await Registration.findOneAndDelete({
          $and: [
            { type: "Exhibitor" },
            { boothId: mongoose.Types.ObjectId(req.params.id) },
            { userEmail: element },
          ],
        });
      }

      // Check which emails are new => Check if user with that email exists on Bluemeet or not => Follow regular way as did during adding booth

      let difference = req.body.emails.filter(
        (x) => !emailsBeforeUpdate.includes(x)
      );

      // This difference is the array of new emails that are added in this update

      for (let element of difference) {
        // For every mail in booth
        // Step 1 => check if there is any user with that email already on platform
        const existingUser = await User.findOne({ email: element });
        if (existingUser) {
          // user already have account on Bluemeet
          // => create exhibitor registration and mark as completed for this email and send magic link to exhibitor mail
          const newRegistration = await Registration.create({
            boothId: boothDoc._id,
            type: "Exhibitor",
            status: "Completed",
            viaCommunity: true,
            cancelled: false,
            eventName: eventDoc.eventName,
            userName: existingUser.firstName + " " + existingUser.lastName,
            userImage: existingUser.image,
            bookedByUser: existingUser._id,
            bookedForEventId: eventDoc._id,
            eventByCommunityId: communityDoc._id,
            createdAt: Date.now(),
            email: element,
            userEmail: element,
            first_name: existingUser.firstName,
            last_name: existingUser.lastName,
            name: existingUser.firstName + " " + existingUser.lastName,
            organisation: existingUser.organisation,
            designation: existingUser.designation,
            city: existingUser.city,
            country: existingUser.country,
            event_name: eventDoc.eventName,
            event_picture: eventDoc.image,
            community_picture: communityDoc.image,
          });

          // Provide magic_link and invitation link
          newRegistration.magic_link = `http://localhost:3001/event/booth/${newRegistration._id}`;
          newRegistration.invitationLink = `http://localhost:3001/event/booth/${newRegistration._id}`;

          // Add this event in users registered events and push this registration in users resgistrations doc.
          existingUser.registeredInEvents.push(eventDoc._id);
          existingUser.registrations.push(newRegistration._id);

          // Save user doc and registration doc
          await existingUser.save({ new: true, validateModifiedOnly: true });
          await newRegistration.save({
            new: true,
            validateModifiedOnly: true,
          });

          // Send mail to exhibitor with magic_link

          const msg = {
            to: element,
            from: "shreyanshshah242@gmail.com",
            subject: `Your are invited as a exhibitor in ${eventDoc.eventName}`,
            text: `use this link to join this event ${
              eventDoc.eventName
            } as a booth exhibitor. ${`http://localhost:3001/event/booth/${newRegistration._id}`}`,
            // html: TeamInviteTemplate(urlToBeSent, communityDoc, userDoc),
          };

          sgMail
            .send(msg)
            .then(async () => {
              console.log("Invitation sent to booth exhibitor.");
            })
            .catch(async (error) => {
              console.log("Failed to send invitation to booth exhibitor");
            });

          // This case is properly handled.
        } else {
          // user does not  have account on Bluemeet
          // => create exhibitor registration and mark as pending for this email and send magic link to exhibitor mail

          const newRegistration = await Registration.create({
            boothId: boothDoc._id,
            type: "Exhibitor",
            status: "Pending",
            viaCommunity: true,
            cancelled: false,
            eventName: eventDoc.eventName,
            bookedForEventId: eventDoc._id,
            eventByCommunityId: communityDoc._id,
            createdAt: Date.now(),
            email: element,
            userEmail: element,
            event_name: eventDoc.eventName,
            event_picture: eventDoc.image,
            community_picture: communityDoc.image,
          });

          // Provide magic_link and invitation link
          newRegistration.magic_link = `http://localhost:3001/event/booth/${newRegistration._id}`;
          newRegistration.invitationLink = `http://localhost:3001/event/booth/${newRegistration._id}`;

          // Save user doc and registration doc
          await newRegistration.save({
            new: true,
            validateModifiedOnly: true,
          });

          // Send mail to exhibitor with magic_link

          const msg = {
            to: element,
            from: "shreyanshshah242@gmail.com",
            subject: `Your are invited as a exhibitor in ${eventDoc.eventName}`,
            text: `use this link to join this event ${
              eventDoc.eventName
            } as a booth exhibitor. ${`http://localhost:3001/event/booth/${newRegistration._id}`}`,
            // html: TeamInviteTemplate(urlToBeSent, communityDoc, userDoc),
          };

          sgMail
            .send(msg)
            .then(async () => {
              console.log("Invitation sent to booth exhibitor.");
            })
            .catch(async (error) => {
              console.log("Failed to send invitation to booth exhibitor");
            });

          // This case is properly handled.
        }
      }
    }

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

    // Tags update

    let uniqueTags = [];

    // Get all booths of this event => collect unique tags from all of them
    for (element of eventDoc.booths) {
      const boothDoc = await Booth.findById(element);
      for (item of boothDoc.tags) {
        if (!uniqueTags.includes(item)) {
          uniqueTags.push(item);
        }
      }
    }

    // Assign these tags to boothTags in this event

    eventDoc.boothTags = uniqueTags;

    await eventDoc.save({ new: true, validateModifiedOnly: true });

    res.status(200).json({
      status: "success",
      data: doublyUpdatedBooth,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.sendBoothInvitation = catchAsync(async (req, res, next) => {
  const boothId = req.params.boothId;

  const boothDoc = await Booth.findById(boothId, (err, doc) => {
    if (!err) {
      // Send invitation mail to every one in doc.emails

      for (let element of doc.emails) {
        const msg = {
          to: element, // Change to your recipient
          from: "shreyanshshah242@gmail.com", // Change to your verified sender
          subject: "Your Event Invitation Link",
          text: `Hi, use this link to join this event as a booth exhibitor. ${doc.invitationLink}.`,
          // html: TeamInviteTemplate(urlToBeSent, communityDoc, userDoc),
        };

        sgMail
          .send(msg)
          .then(() => {
            console.log("Sent mail to booth participant.");
          })
          .catch(() => {
            console.log("Failed to sent mail to booth participant.");
          });
      }
    }
  });

  res.status(200).json({
    status: "success",
    message: "Invitation sent to all booth exhibitors.",
  });
});
