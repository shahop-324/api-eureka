const request = require("request");
const catchAsync = require("../utils/catchAsync");

var options = {
  method: "POST",
  url: "https://api.netless.link/v5/rooms",
  headers: {
    token:
      "NETLESSSDK_YWs9N1FVdFFYS2Q3c1lwWDl4NSZub25jZT05YWJhMDdlMC01ZThmLTExZWMtYjU2Ny1jNzRlYzgxMjMyYjUmcm9sZT0wJnNpZz1jMjEyM2Y1Mzg1YWQ5ODJiOGNjYjZkNDE2ZDgzOGQ0YjcxMTc4N2RkMDZlNWFhMTE4ZDM4MGFhMTU3NjA5NDNk",
    "Content-Type": "application/json",
    region: "in-mum",
  },
  body: JSON.stringify({
    isRecord: false,
  }),
};

var roomTokenOptions = {
    "method": "POST",
     // Replace <Room UUID> with the uuid of your room
    "url": "https://api.netless.link/v5/tokens/rooms/31c9e0805e9311ec985273b1c68874d8", 
    "headers": {
    "token": "NETLESSSDK_YWs9N1FVdFFYS2Q3c1lwWDl4NSZub25jZT05YWJhMDdlMC01ZThmLTExZWMtYjU2Ny1jNzRlYzgxMjMyYjUmcm9sZT0wJnNpZz1jMjEyM2Y1Mzg1YWQ5ODJiOGNjYjZkNDE2ZDgzOGQ0YjcxMTc4N2RkMDZlNWFhMTE4ZDM4MGFhMTU3NjA5NDNk",
    "Content-Type": "application/json",
    "region": "in-mum"
    },
    body: JSON.stringify({"lifespan":3600000,"role":"admin"})
  };

exports.createWhiteboardRoom = catchAsync(async (req, res, next) => {
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);

    res.status(200).json({
      status: "success",
      data: response.body,
    });
  });
});


exports.generateWhiteboardRoomToken = catchAsync(async(req, res, next) => {
    request(roomTokenOptions, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        
        res.status(200).json({
            status: "success",
            data: response.body,
          });
      });
})