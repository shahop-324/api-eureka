const catchAsync = require("../utils/catchAsync");
const feedBack = require("../models/feedBackModel");
const sgMail = require("@sendgrid/mail");
const FeedbackReceived = require("../Mail/FeedbackReceived");

sgMail.setApiKey(process.env.SENDGRID_KEY);

exports.createFeedback = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const communityId = req.community.id;

  // creating one document in db including
  const newlyCreatedFeedback = await feedBack.create({
    feedbackText: req.body.feedbackText,
    createdByUser: {
      userId: userId,
      userEmail: req.user.email,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      userImg: req.user.image,
    },
    createdByCommunity: {
      communityId: communityId,
      communityName: req.community.name,
    },
  });

  // Send thanks mail for providing feedback
  const msg = {
    to: req.user.email, // Change to your recipient
    from: "shreyanshshah242@gmail.com", // Change to your verified sender
    subject: "We have recieved your feedback",
    text: `Hey, we wanna say thank you for helping us get better by providing your valuable feedback.`,
    html: FeedbackReceived(),
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Feedback thanks mail sent to user.");
    })
    .catch((error) => {
      console.log("Failed to send feedback thanks mail sent to user.");
    });

  res.status(200).json({
    status: "success",
    data: {
      feedback: newlyCreatedFeedback,
    },
  });
});
