const Razorpay = require("razorpay");
const crypto = require("crypto");
const catchAsync = require("../../utils/catchAsync");

const razorpay = new Razorpay({
  key_id: "rzp_test_pHbL8wg7ApJttl",
  key_secret: "YwRmrbTadItoMJFDUiY3xNZ8",
});

exports.createRazorpayOrder = catchAsync(async (req, res, next) => {
  const newOrder = razorpay.orders.create(
    {
      amount: 100000,
      currency: "INR",
      receipt: "receipt#123OP",
      notes: {
        userId: "gvau729jbhusiadbsGBS",
        ticketId: "wgsbjuw28368hjhuHI",
      },
    },
    (err, order) => {
      console.log(order);
      res.status(200).json({
        status: "success",
        data: order,
      });
    }
  );
});

exports.listenForSuccessfulRegistration = catchAsync(async (req, res, next) => {
  const secret = "12345678";

  console.log(req.body.payload.payment);

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("Request is legit");
    // Issue a successful registration ticket
  } else {
    // pass it
  }

  res.status(200).json({
    status: "success",
  });
});
