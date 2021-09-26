const catchAsync = require('../utils/catchAsync');
const AWS = require('aws-sdk');
const UUID = require('uuid/v1');

const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: 'us-west-1',
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
});

exports.uploadImg = catchAsync((req, res, next) => {
  const userId = req.user.id;
  const key = `${userId}/${UUID()}.jpeg`;
  s3.getSignedUrl(
    'putObject',
    {
      Bucket: 'bluemeet',
      Key: key,
      ContentType: 'image/jpeg',
    },
    (err, url) => {
      res.send({key, url, err});
    }
  );
});
