const catchAsync = require('../utils/catchAsync');

exports.getAllBills = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'This route is not yet implemented',
  });
});

exports.payBill = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'This route is not yet implemented',
  });
});
