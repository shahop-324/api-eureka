const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

// Used when generating any kind of Access Token

const twilioAccountSid = "AC7ed7b0172eb89a58b994f059c8016b3d";
const twilioApiKey = "SK66dd51381995a63c1bc09b19c2e1cf29";
const twilioApiSecret = "0xUrEi2EPeaIkRP9WjaXOZpQz5tDRuZV";

exports.createRoomAccessToken = catchAsync(async (req, res, next) => {
    console.log(req.body.tableId);
    console.log(req.user._id);
  const tableId = req.body.tableId;
  const userId = req.user._id;
  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret
  );
  token.identity = userId;

  // Create a Video grant which enables a client to use Video
  // and limits access to the specified Room (DailyStandup)
  const videoGrant = new VideoGrant();

  // Add the grant to the token
  token.addGrant(videoGrant);

  // Serialize the token to a JWT string

  const twillioAccessToken = token.toJwt();

  console.log(token.toJwt());

  res.status(201).json({
    status: "success",
    data: {
      twillioAccessToken,
    },
  });
});
