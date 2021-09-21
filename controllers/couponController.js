const Community = require("../models/communityModel");
const Coupon = require("../models/couponModel");
const Event = require("../models/eventModel");
const catchAsync = require("../utils/catchAsync");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getOneCoupon = catchAsync(async (req, res, next) => {


  const coupon = await Coupon.findById(req.params.id).populate(
    "discountForEventId"
  );

 

  res.status(200).json({
    status: "success",
    data: coupon,
  });
});

exports.CreateNewCoupon = catchAsync(async (req, res, next) => {

  const eventId = req.body.discountForEventId;
  const communityId = req.community.id;

  const eventGettingCoupon = await Event.findById(eventId);
  const communityGettingCoupon = await Community.findById(communityId);

  // 1) when a new coupon is created then create a new document in Coupons Resource
  const createdCoupon = await Coupon.create({
    discountForEventId: req.body.discountForEventId,
    discountPercentage: req.body.discountPercentage,
    discountCode: req.body.discountCode,
    validTillDate: req.body.validTillDate,
    validTillTime: req.body.validTillTime,
    maxNumOfDiscountPermitted: req.body.maxNumOfDiscountPermitted,
  });

  // 2) Update Coupons field in corresponding event document for which this coupon is created
  eventGettingCoupon.coupon.push(createdCoupon.id);
  await eventGettingCoupon.save({ validateModifiedOnly: true });

  // 3) Update coupons field in corresponding community document for which this coupon is created
  communityGettingCoupon.coupons.push(createdCoupon.id);
  await communityGettingCoupon.save({ validateModifiedOnly: true });

  // 3) Send the newly created coupon document back to client
  res.status(200).json({
    status: "success",
    data: createdCoupon,
  });
});

exports.getAllCoupons = catchAsync(async (req, res, next) => {

  let couponDocs = await Community.findById(req.community.id)
    .select("coupons")
    .populate({
      path: "coupons",
      populate: {
        path: "discountForEventId",
      },
    });

couponDocs = couponDocs.coupons.filter((coupon) => coupon.status !== "Deleted");

  res.status(200).json({
    status: "success",
    data: couponDocs,
  });
});

exports.UpdateCoupon = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "validTillDate",
    "validTillTime",
    "discountPercentage",
    "discountCode",
    "maxNumOfDiscountPermitted"
  );

  const updatedCoupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      validateModifiedOnly: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: updatedCoupon,
  });
});

exports.DeleteCoupon = catchAsync(async (req, res, next) => {
 const deletedCoupon =  await Coupon.findByIdAndUpdate(
    req.params.id,
    { status: "Deleted", active: false },
    {
      new: true,
      runValidators: true,
    }
  );

  const id = deletedCoupon._id;

  res.status(200).json({
    status: "success",
    data: {
      id,
    }
  });
});
