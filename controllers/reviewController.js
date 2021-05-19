const Community = require('../models/communityModel');
const Event = require('../models/eventModel');
const catchAsync = require('../utils/catchAsync');
const ReviewsRef = require('../models/reviewsIdsCommunityWise');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const communityWhichWantsAllItsReviews = await Community.findById(
    req.community._id
  );
  // console.log(communityWhichWantsAllItsReviews.reviewsDocId);
  // const x = await ReviewsRef.findById(
  //   communityWhichWantsAllItsReviews.reviewsDocId
  // );
  // console.log(x);
  const communityAllReviews = await ReviewsRef.findById(
    communityWhichWantsAllItsReviews.reviewsDocId
  )
    .populate('reviews')
    .select('reviews');
  const obj = await JSON.parse(JSON.stringify(communityAllReviews));
  console.log(obj);
  const { reviews } = obj;
  res.status(200).json({
    status: 'success',
    length: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getAllReviewsForOneEvent = catchAsync(async (req, res, next) => {
  const reviewDocs = await Event.findById(req.params.eventId)
    .populate({
      path: 'reviews',
      select: 'userName rating reviewComment userImg',
    })
    .select('reviews');
  console.log(reviewDocs);
  const obj = await JSON.parse(JSON.stringify(reviewDocs));
  const { reviews } = obj;
  res.status(200).json({
    status: 'success',
    length: reviews.length,
    data: reviews,
  });
});
