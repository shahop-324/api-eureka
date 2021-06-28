const catchAsync = require('../utils/catchAsync');
const Community = require('./../models/communityModel');

// I am trying to get all queries of cummnity i have community_id so i find it and from there but one thing is there if i store every query id there this array will grow indefinitely in size because we want to provide each and every queries because we are trying to store each query so idd one solutoin is that we store only reference here and all id at partocuylar place make one collection in which we have all query of particular community sot ot do that we can make one schema for queryReference which store reference and from there actually we store everything here only reference and put its reference of every query here with community id
exports.getAllQueries = catchAsync(async (req, res, next) => {
  Community.findById(req.community._id);
  res.status(200).json({
    status: 'success',
    message: 'This route is not yet implemented',
  });
});

exports.answerQuery = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'This route is not yet implemented',
  });
});

exports.getAllQueriesForOneEvent = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'This route is not yet implemented',
  });
});
