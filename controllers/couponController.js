const Community = require('../models/communityModel');
const Coupon = require('../models/couponModel');
const Event = require('../models/eventModel');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newobj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.el) newobj[el] = obj[el];
  });
  return newobj;
};

exports.CreateNewCoupon = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;
  const communityId = req.community.id;

  const eventGettingCoupon = await Event.findById(eventId);
  const communityGettingCoupon = await Community.findById(communityId);

  // 1) when a new coupon is created then create a new document in Coupons Resource
  const createdCoupon = await Coupon.create({
    discountForEventId: req.params.eventId,
    discountDescription: req.body.discountDescription,
    discountPercentage: req.body.discountPercentage,
    discountCode: req.body.couponCode,
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
    status: 'success',
    data: {
      Coupon: createdCoupon,
    },
  });
});

exports.getAllCoupons = catchAsync(async (req, res, next) => {
 const couponDocs = await Community.findById(req.community.id).select('coupons');

 const obj = await JSON.parse(JSON.stringify(couponDocs));
  const { coupons } = obj;
 
  res.status(200).json({
    status: 'success',
    length: coupons.length,
    data: coupons,
  });
});

exports.UpdateCoupon = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    'validTillDate',
    'validTillTime',
    'discountDescription',
    'discountPercentage',
    'discountCode',
    'maxNumOfDiscountPermitted'
  );
  
  const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.couponId, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: updatedCoupon,
  });
});

exports.DeleteCoupon = catchAsync(async (req, res, next) => {
    await Coupon.findByIdAndUpdate(req.params.couponId, {active: false}, {
    new: true,
    runValidators: true,
  });
  res.status(204).json({
    status: 'success',
  });
});
