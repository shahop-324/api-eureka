const catchAsync = require("../utils/catchAsync");
const Video = require("./../models/videoModel");
const EventVideo = require("./../models/eventVideosModel");
const Event = require("./../models/eventModel");

exports.linkVideo = catchAsync(async (req, res, next) => {
  try {
    // Find video from Video resource then add eventId to its listOfLinkedEvents and then save

    const videoDoc = await Video.findById(req.body.videoId);
    videoDoc.linkedToEvents.push(req.body.eventId);
    await videoDoc.save({ new: true, validateModifiedOnly: true });

    // Find eventDoc and push videoId to linkedVideos list and then save eventDoc

    const eventDoc = await Event.findById(req.body.eventId);
    eventDoc.linkedVideos.push(videoDoc._id);
    await eventDoc.save({ new: true, validateModifiedOnly: true });

    let videos = await EventVideo.find({ eventId: req.body.eventId });

    // also find all linked videos
  
    for (let element of eventDoc.linkedVideos) {
      await Video.findById(element, (err, doc) => {
        if (err) {
          console.log(err);
        } else {
          if (doc) {
            videos.push(doc);
          }
        }
      });
    }
  
    res.status(200).json({
      status: "success",
      videos: videos,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.unlinkVideo = catchAsync(async (req, res, next) => {
  try {
    console.log("We entered into unlink video");
    // Find video from Video resource then remove eventId from its listOfLinkedEvents and then save
    const videoDoc = await Video.findById(req.body.videoId);
    videoDoc.linkedToEvents = videoDoc.linkedToEvents.filter(
      (el) => el.toString() !== req.body.eventId.toString()
    );
    await videoDoc.save({ new: true, validateModifiedOnly: true });

    // Find eventDoc and remove videoId from linkedVideos list and then save eventDoc

    const eventDoc = await Event.findById(req.body.eventId);
    eventDoc.linkedVideos = eventDoc.linkedVideos.filter(
      (el) => el.toString() !== req.body.videoId.toString()
    );
    await eventDoc.save({ new: true, validateModifiedOnly: true });

    let videos = await EventVideo.find({ eventId: req.body.eventId });

    // also find all linked videos
  
    for (let element of eventDoc.linkedVideos) {
      await Video.findById(element, (err, doc) => {
        if (err) {
          console.log(err);
        } else {
          if (doc) {
            videos.push(doc);
          }
        }
      });
    }
  
    res.status(200).json({
      status: "success",
      videos: videos,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.getEventVideos = catchAsync(async (req, res, next) => {
  let videos = await EventVideo.find({ eventId: req.body.eventId });

  // also find all linked videos

  const eventDoc = await Event.findById(req.body.eventId);

  for (let element of eventDoc.linkedVideos) {
    await Video.findById(element, (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        if (doc) {
          videos.push(doc);
        }
      }
    });
  }

  res.status(200).json({
    status: "success",
    videos: videos,
  });
});
