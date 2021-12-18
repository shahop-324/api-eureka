const catchAsync = require("./../utils/catchAsync");
const EventChatMessage = require("./../models/eventChatMessageModel");
const EventAlert = require("./../models/eventAlertsModel");
const EventReport = require("./../models/eventReportsModel");
const Session = require("./../models/sessionModel");
const BoothTableChats = require("./../models/boothTableChatsModel");
const BoothChats = require("./../models/boothChatsModel");
const TableChats = require("./../models/tableChatsModel");
const SessionQnA = require("./../models/sessionQnAModel");
const SessionPoll = require("./../models/sessionPollModel");
const SessionChatMessage = require("./../models/sessionChatMessageModel");

exports.seenEventChat = catchAsync(async (req, res, next) => {
  const chatId = req.params.msgId;
  const userId = req.user._id;

  // Ensure that this userId is not already present in seenBy Array

  const chatDoc = await EventChatMessage.findById(chatId);

  chatDoc.seenBy = chatDoc.seenBy.filter(
    (el) => el.toString() !== userId.toString()
  );

  chatDoc.seenBy.push(userId);

  await chatDoc.save({ new: true, validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
  });
});

exports.seenEventAlert = catchAsync(async (req, res, next) => {
  const alertId = req.params.alertId;
  const userId = req.user._id;

  // Ensure that this userId is not already present in seenBy Array

  const alertDoc = await EventAlert.findById(alertId);

  alertDoc.seenBy = alertDoc.seenBy.filter(
    (el) => el.toString() !== userId.toString()
  );

  alertDoc.seenBy.push(userId);

  await alertDoc.save({ new: true, validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
  });
});

exports.seenEventReport = catchAsync(async (req, res, next) => {
  const reportId = req.params.reportId;
  const userId = req.user._id;

  // Ensure that this userId is not already present in seenBy Array

  const reportDoc = await EventReport.findById(reportId);

  reportDoc.seenBy = reportDoc.seenBy.filter(
    (el) => el.toString() !== userId.toString()
  );

  reportDoc.seenBy.push(userId);

  await reportDoc.save({ new: true, validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
  });
});

exports.seenRaisedHand = catchAsync(async (req, res, next) => {
  try {
    const handRaisedByUser = req.params.userId;
    const sessionId = req.params.sessionId;
    const userId = req.user._id;

    // Ensure that this userId is not already present in seenBy Array

    const sessionDoc = await Session.findById(sessionId);

    let allRaisedHands = sessionDoc.raisedHands;

    console.log(allRaisedHands, handRaisedByUser);

    const raisedHand = allRaisedHands.find(
      (el) => el.userId.toString() == handRaisedByUser.toString()
    );

    if (raisedHand) {
      raisedHand.seenBy = raisedHand.seenBy.filter(
        (el) => el.userId.toString() !== userId.toString()
      );

      raisedHand.seenBy.push(userId);

      await raisedHand.save({ new: true, validateModifiedOnly: true });
    }

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "Errror",
    });
  }
});
exports.seenSessionChat = catchAsync(async (req, res, next) => {
  const chatId = req.params.msgId;
  const userId = req.user._id;

  // Ensure that this userId is not already present in seenBy Array

  const sessionChatDoc = await SessionChatMessage.findById(chatId);

  sessionChatDoc.seenBy = sessionChatDoc.seenBy.filter(
    (el) => el.toString() !== userId.toString()
  );

  sessionChatDoc.seenBy.push(userId);

  await sessionChatDoc.save({ new: true, validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
  });
});
exports.seenSessionQnA = catchAsync(async (req, res, next) => {
  const qnaId = req.params.qnaId;
  const userId = req.user._id;

  // Ensure that this userId is not already present in seenBy Array

  const qnaDoc = await SessionQnA.findById(qnaId);

  qnaDoc.seenBy = qnDoc.seenBy.filter(
    (el) => el.toString() !== userId.toString()
  );

  qnaDoc.seenBy.push(userId);

  await qnaDoc.save({ new: true, validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
  });
});
exports.seenSessionPoll = catchAsync(async (req, res, next) => {
  const pollId = req.params.pollId;
  const userId = req.user._id;

  // Ensure that this userId is not already present in seenBy Array

  const pollDoc = await SessionPoll.findById(pollId);

  pollDoc.seenBy = pollDoc.seenBy.filter(
    (el) => el.toString() !== userId.toString()
  );

  pollDoc.seenBy.push(userId);

  await pollDoc.save({ new: true, validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
  });
});

exports.seenRoomChat = catchAsync(async (req, res, next) => {
  const chatId = req.params.msgId;
  const userId = req.user._id;

  // Ensure that this userId is not already present in seenBy Array

  const tableChatDoc = await TableChats.findById(chatId);

  tableChatDoc.seenBy = tableChatDoc.seenBy.filter(
    (el) => el.toString() !== userId.toString()
  );

  tableChatDoc.seenBy.push(userId);

  await tableChatDoc.save({ new: true, validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
  });
});
exports.seenBoothTableChat = catchAsync(async (req, res, next) => {
  const chatId = req.params.msgId;
  const userId = req.user._id;

  // Ensure that this userId is not already present in seenBy Array

  const boothTableChatDoc = await BoothTableChats.findById(chatId);

  boothTableChatDoc.seenBy = boothTableChatDoc.seenBy.filter(
    (el) => el.toString() !== userId.toString()
  );

  boothTableChatDoc.seenBy.push(userId);

  await boothTableChatDoc.save({ new: true, validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
  });
});

exports.seenBoothChats = catchAsync(async (req, res, next) => {
  const chatId = req.params.msgId;
  const userId = req.user._id;

  // Ensure that this userId is not already present in seenBy Array

  const boothChatDoc = await BoothChats.findById(chatId);

  boothChatDoc.seenBy = boothChatDoc.seenBy.filter(
    (el) => el.toString() !== userId.toString()
  );

  boothChatDoc.seenBy.push(userId);

  await boothChatDoc.save({ new: true, validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
  });
});
