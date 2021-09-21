const catchAsync = require("./../utils/catchAsync");

const TeamInvite = require("./../models/teamInviteModel");
const Community = require("../models/communityModel");
const User = require("../models/userModel");
const TeamInviteTemplate = require("../services/email/teamInviteTemplate");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

exports.createNewInvitation = catchAsync(async (req, res, next) => {
  const inviteeId = req.user.id;
  const communityId = req.community.id;
  const email = req.body.email;
  const permissions = req.body.permissions;
  let urlToBeSent;
  let name;
  let image;

  const communityDoc = await Community.findById(communityId);
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
    permissionsAlloted: permissions,
    userAlreadyOnPlatform: bool,
    existingUserName: name,
    existingUserImage: image,
    createdAt: Date.now(),
  });

  if (existingUser) {
    urlToBeSent = `http://localhost:3000/eureka/v1/accept-invite/${newlyCreatedInvitation._id}`;
  } else {
    urlToBeSent = `http://localhost:3000/eureka/v1/signup/${newlyCreatedInvitation._id}/?intent=accept-invite/`;
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
   
      // 3.) Store newly created invitation in notYetAcceptedInvitations of Community Doc
      communityDoc.notYetAcceptedInvitations.push(newlyCreatedInvitation._id);
      await communityDoc.save({validateModifiedOnly: true});

     
      res.status(200).json({
        status: "success",
        message: "Invite Link sent to email!",
      });
    })
    .catch((error) => {
    
    });
});
