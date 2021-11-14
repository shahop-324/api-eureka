const catchAsync = require("./../utils/catchAsync");
const Mail = require("./../models/eventMailModel");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.createNewMail = catchAsync(async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const templateName = req.body.templateName;
    const subject = req.body.templateName;
    const preHeader = req.body.preHeader;
    const mailBody = req.body.mailBody;
    const customBranding = req.body.customBranding;

    const recipient = req.body.recipient;

    const NewMail = await Mail.create({
      eventId: eventId,
      templateName: templateName,
      subject: subject,
      preHeader: preHeader,
      body: JSON.stringify(mailBody),
      timestamp: Date.now(),
      customBranding: customBranding,
      recipient: recipient,
    });

    res.status(200).json({
      status: "success",
      data: NewMail,
    });
  } catch (error) {
    console.log(error);
  }
});

exports.updateMail = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "templateName",
    "subject",
    "preHeader",
    "body",
    "customBranding",
    "recipient"
  );

  const mailDoc = await Mail.findByIdAndUpdate(
    req.params.mailId,
    filteredBody,
    {
      new: true,
      validateModifiedOnly: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: mailDoc,
  });
});

exports.sendMail = catchAsync(async (req, res, next) => {
  const mailId = req.params.mailId;
  const receivers = req.body.recepients;

  const mailDoc = await Mail.findById(mailId);

  // * Send mail to all applicable candidates with personalisation.

  for (let element of receivers) {
    const msg = {
      to: element, // Change to your recipient
      from: "shreyanshshah242@gmail.com", // Change to your verified sender
      subject: mailDoc.subject,
      // text: `${totalNumOfCodes} Codes have been successfully applied to your Bluemeet Community. ${communityDoc.name}.`,
      html: mailDoc.html,
    };

    sgMail
      .send(msg)
      .then(async () => {
        console.log("Mail sent successfully!");
      })
      .catch(async (error) => {
        console.log("Failed to send mail.");
      });
  }

  // * Update status of mailDoc to sent

  mailDoc.status = "Sent";
  await mailDoc.save({ new: true, validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
  });
});

exports.deleteMail = catchAsync(async (req, res, next) => {
  const mailId = req.params.mailId;

  await Mail.findByIdAndDelete(mailId, (error, doc) => {
    if (error) {
      res.status(400).json({
        status: "Error",
        message: "Failed to delete mail. Please try again later.",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Mail successfully deleted!",
      });
    }
  });
});

exports.getOneMail = catchAsync(async (req, res, next) => {
  const mailId = req.params.mailId;

  await Mail.findById(mailId, (error, doc) => {
    if (error) {
      res.status(400).json({
        status: "Error",
        message: "Failed to fetch mail. Please try again later.",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: doc,
      });
    }
  });
});

exports.getMails = catchAsync(async (req, res, next) => {
  const eventId = req.params.eventId;

  await Mail.find({ eventId: eventId }, (err, doc) => {
    if (err) {
      res.status(400).json({
        status: "Error",
        message: "Failed to fetch mails. Please try again later.",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: doc,
      });
    }
  });
});

// * Send Test Email

exports.sendTestMail = catchAsync(async (req, res, next) => {
  const mailId = req.params.mailId;

  const mailDoc = await Mail.findById(mailId);
  const receiver = req.body.recieverMail;

  const msg = {
    to: receiver, // Change to your recipient
    from: "shreyanshshah242@gmail.com", // Change to your verified sender
    subject: mailDoc.subject,
    // text: `${totalNumOfCodes} Codes have been successfully applied to your Bluemeet Community. ${communityDoc.name}.`,
    html: mailDoc.html,
  };

  sgMail
    .send(msg)
    .then(async () => {
      res.status(200).json({
        status: "success",
        message: "Test mail sent successfully!",
      });
    })
    .catch(async (error) => {
      res.status(400).json({
        status: "error",
        message: "Failed to send test mail, Please try again.",
      });
    });
});
