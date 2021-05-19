const catchAsync = require('../utils/catchAsync');
const feedBack = require('../models/feedBackModel');
exports.createFeedback = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const communityId = req.community.id;
  // creating one document in db including
  const newlyCreatedFeedback = await feedBack.create({
    title: req.body.title,
    bodyOfFeedback: req.body.bodyOfFeedback,
    createdByUser: {
      userId: userId,
      name: `${req.user.firstName} ${req.user.lastName}`,
      img: req.user.photo,
      //TODO this role feature will be implemented later
      // role:req.user.role
    },
    createdByCommunity: {
      communityId: communityId,
      communityName: req.community.name,
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      feedback: newlyCreatedFeedback,
    },
  });
});
