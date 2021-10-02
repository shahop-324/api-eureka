const catchAsync = require("./../utils/catchAsync");
const mongoose = require("mongoose");

const TeamInvite = require("./../models/teamInviteModel");
const Community = require("../models/communityModel");
const User = require("../models/userModel");
const TeamInviteTemplate = require("../services/email/teamInviteTemplate");

const sgMail = require("@sendgrid/mail");
const { Mongoose } = require("mongoose");
sgMail.setApiKey(process.env.SENDGRID_KEY);

exports.createNewInvitation = catchAsync(async (req, res, next) => {
  const inviteeId = req.body.userId;
  const communityId = req.community.id;
  const email = req.body.email;

  let urlToBeSent;
  let name;
  let image;

  const communityDoc = await Community.findById(communityId);

  const superAdminEmail = communityDoc.superAdminEmail;

  const eventManagers = await Community.findById(communityId).populate(
    "eventManagers",
    "email"
  );

  const pendingInvitations = await TeamInvite.find({
    $and: [
      { communityId: mongoose.Types.ObjectId(communityId) },
      { status: "Pending" },
    ],
  });

  // .push(superAdminEmail)

  const newArray = pendingInvitations
    .map((el) => el.invitedUserEmail)
    .concat(eventManagers.eventManagers.map((el) => el.email));
  console.log(newArray);

  const userDoc = await User.findById(inviteeId);

  const existingUser = await User.findOne({ email: email });

  const bool = existingUser ? true : false;

  if (existingUser) {
    name = `${existingUser.firstName} ${existingUser.lastName}`;
    image = existingUser.image;
  }

  const newlyCreatedInvitation = await TeamInvite.create({
    communityId: communityId,
    status: "Pending",
    communityName: communityDoc.name,
    communityImage: communityDoc.image,
    inviteeId: inviteeId,
    inviteeName: `${userDoc.firstName} ${userDoc.lastName}`,
    invitedUserEmail: email,
    // permissionsAlloted: permissions,
    userAlreadyOnPlatform: bool,
    existingUserName: name,
    existingUserImage: image,
    createdAt: Date.now(),
  });

  if (existingUser) {
    urlToBeSent = `http://localhost:3001/accept-invite/${newlyCreatedInvitation._id}`;
  } else {
    urlToBeSent = `http://localhost:3001/signup/${newlyCreatedInvitation._id}/?intent=accept-invite/`;
  }

  // 2.) Send new Invitation via mail to user
  const msg = {
    to: email, // Change to your recipient
    from: "shreyanshshah242@gmail.com", // Change to your verified sender
    subject: "Your Community Invitation Link",
    text: "use this link to accept invitation from this community.",
    html: TeamInviteTemplate(urlToBeSent, communityDoc, userDoc),
  };

  sgMail
    .send(msg)
    .then(async () => {
      res.status(200).json({
        status: "success",
        message: "Invite Link sent to email!",
        newlyCreatedInvitation: newlyCreatedInvitation,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

exports.acceptInvitation = catchAsync(async (req, res, next) => {
  const invitationId = req.params.invitationId;

  const InviteDoc = await TeamInvite.findById(invitationId);

  const status = InviteDoc.status;

  const userEmail = InviteDoc.invitedUserEmail;

  const communityId = InviteDoc.communityId;

  const userDoc = await User.findOne({ email: userEmail });

  const CommunityDoc = await Community.findById(communityId).populate(
    "eventManagers",
    "email"
  );

  const bool = CommunityDoc.eventManagers.includes(userEmail);

  if (bool) {
    // Already accepted invitation
    res.status(200).json({
      status: "success",
      message: "Already in this community",
      code: "A001",
    });
  }

  if (InviteDoc.canceled) {
    res.status(200).json({
      status: "success",
      message: "This invitation is not valid anymore, Removed by super admin.",
      code: "C001",
    });
  }

  if (status === "Accepted") {
    res.status(200).json({
      status: "success",
      message: "Already accepted this invitation",
      code: "A002",
    });
  } else {
    // accept invitaion

    // Push this persons userId in eventManagers array in community
    CommunityDoc.eventManagers.push(userDoc._id);
    await CommunityDoc.save({ new: true, validateModifiedOnly: true });

    // add this community in this users doc in invited communities array
    userDoc.invitedCommunities.push(communityId);
    await userDoc.save({ new: true, validateModifiedOnly: true });

    // Mark this invitation document status as accepted
    InviteDoc.status = "Accepted";
    await InviteDoc.save({ new: true, validateModifiedOnly: true });

    res.status(200).json({
      status: "success",
      message: "successfully accepted invitation to join community!",
      code: "S001",
    });
  }
});

exports.fetchPendingInvitations = catchAsync(async (req, res, next) => {
  const communityId = req.community._id;

  const pendingInvitations = await TeamInvite.find({
    $and: [
      { communityId: mongoose.Types.ObjectId(communityId) },
      { status: "Pending" },
      { canceled: false },
    ],
  });

  res.status(200).json({
    status: "success",
    pendingInvitations: pendingInvitations,
  });
});

exports.fetchCommunityManagers = catchAsync(async (req, res, next) => {
  const communityId = req.community._id;

  const communityManagers = await Community.findById(communityId)
    .select("eventManagers")
    .populate("eventManagers", "firstName lastName email image");

  res.status(200).json({
    status: "success",
    communityManagers: communityManagers,
  });
});

exports.removeFromTeam = catchAsync(async (req, res, next) => {
  const communityId = req.community._id;
  const email = req.body.email;
  const status = req.body.status;

  if (status === "Pending") {
    await TeamInvite.findOneAndUpdate(
      { invitedUserEmail: email },
      { canceled: true },
      { new: true, validateModifiedOnly: true }
    );
    // Removed from team , now this invitation won't be valid anymore
  }
  if (status === "Accepted") {
    // Remove from user invited communities
    const userDoc = await User.findOne({ email: email });

    userDoc.invitedCommunities = userDoc.invitedCommunities.filter(
      (el) => el !== communityId
    );

    await userDoc.save({ new: true, validateModifiedOnly: true });

    // Remove from community doc eventManagers array
    const communityDoc = await Community.findById(communityId);

    communityDoc.eventManagers = communityDoc.eventManagers.filter(
      (el) => el !== userDoc._id
    );
    await communityDoc.save({ new: true, validateModifiedOnly: true });
  }

  res.status(200).json({
    status: "success",
    message: "successfully removed from team!",
  });
});
