const catchAsync = require("../utils/catchAsync");
const Booth = require("./../models/boothModel");

exports.deleteBooth = catchAsync( async (req, res, next) => {
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


