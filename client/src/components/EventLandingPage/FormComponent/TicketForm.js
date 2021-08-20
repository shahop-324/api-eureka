import React, { useState } from "react";
import { useSelector } from "react-redux";
import Radio from "@material-ui/core/Radio";
import { withStyles } from "@material-ui/core/styles";

import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { Link } from "react-router-dom";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const { REACT_APP_MY_ENV } = process.env;
const BaseURL = REACT_APP_MY_ENV
  ? "http://localhost:3000/api-eureka/eureka/v1/"
  : "https://www.evenz.co.in/api-eureka/eureka/v1/";

// const convertFromJSONToHTML = (text) => {
//   return stateToHTML(convertFromRaw(JSON.parse(text)));
// };

const RoyalBlueRadio = withStyles({
  root: {
    color: "#538BF7",
    "&$checked": {
      color: "#3372F0",
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const TicketForm = ({ eventId, tickets, coupon }) => {
  console.log(tickets);
  console.log(eventId);

  const isSignedIn = useSelector((state) => state.auth.isSignedIn);

  const [state, setState] = React.useState({
    openSuccess: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, openSuccess } = state;

  const handleCloseSuccess = () => {
    setState({ vertical: "top", horizontal: "center", openSuccess: false });
  };

  const [registrationSuccess, setRegistrationSuccess] = React.useState({
    openError: false,
    verticale: "top",
    horizontale: "center",
  });

  const {
    verticalRegistrationSuccess,
    horizontalRegistrationSuccess,
    openRegistrationSuccess,
  } = registrationSuccess;

  const handleCloseRegistrationSuccess = () => {
    setRegistrationSuccess({
      verticalRegistrationSuccess: "top",
      horizontalRegistrationSuccess: "center",
      openRegistrationSuccess: false,
    });
  };

  const event = useSelector((state) => {
    return state.event.eventDetails;
  });

  const userToken = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.user.userDetails);
  const userDetails = useSelector((state) => state.user.userDetails);

  const couponsArray =
    coupon &&
    coupon.map((coupon) => {
      return {
        id: coupon.id,
        code: coupon.discountCode,
        percentage: coupon.discountPercentage,
      };
    });

  const [factor, setFactor] = useState(1);

  const [selectedTicket, setSelectedTicket] = React.useState(
    tickets[0] && tickets[0].id
  );

  const [couponText, setCouponText] = useState("");

  const [couponToBeApplied, setCouponToBeApplied] = useState("");

  const handleChange = (event) => {
    // setSelectedValue((event.target.value)*1);

    setSelectedTicket(event.target.value);
    console.log(event.target.value);
  };

  const handleCouponChange = (event) => {
    setCouponText(event.target.value);
  };

  const handleCouponValidation = () => {
    console.log(couponText);
    console.log(couponsArray);
    const validatedCoupon = couponsArray.filter(
      (coupon) => couponText === coupon.code
    );

    console.log(validatedCoupon);
    setCouponToBeApplied(validatedCoupon);

    const bool = validatedCoupon.length > 0;
    console.log(bool);
    const validationStatus = bool ? "Not valid" : "valid";
    console.log(validationStatus);
    if (bool) {
      setFactor((100 / (100 - validatedCoupon[0].percentage * 1)) * 1);
      setState({ openSuccess: true, vertical: "top", horizontal: "center" });
      console.log(factor);
    } else {
      setFactor(1);
      alert("Invalid coupon code!");
    }
  };

  const displayRazorpay = async () => {
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    let order = await fetch(`${BaseURL}razorpay/createRazorpayOrder`, {
      method: "POST",
      body: JSON.stringify({
        eventId: eventId,
        ticketId: selectedTicket,
        communityId: event.createdBy._id,
        transaction_type: "event_registration",
        userId: user._id,
        couponId:
          couponToBeApplied && couponToBeApplied[0]
            ? couponToBeApplied[0].id
            : null,
      }),

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    order = await order.json();
    console.log(order);

    const options = {
      key: "rzp_live_bDVAURs4oXxSGi",
      amount: order.data.amount,
      currency: "INR",
      name: "Evenz",
      description: `This is a event ticket booking for eventId ${eventId} which is made by user ${userDetails._id} and ticket Id is ${selectedTicket}.`,
      image:
        "https://evenz-img-234.s3.ap-south-1.amazonaws.com/60e1c15b557681e9fc6af91e/evenz_logo.png",
      order_id: order.data.id,
      handler: function (response) {
        alert(
          "Your registration was successful! Check your ticket in Email or Booked Tickets of user profile section."
        );
      },
      prefill: {
        name: `${userDetails.firstName} ${userDetails.lastName}`,
        email: userDetails.email,
      },
      notes: {
        // We can add some notes here

        eventId: eventId,
        ticketId: selectedTicket,
        communityId: event.createdBy._id,
        transaction_type: "event_registration",
        userId: user._id,
        couponId:
          couponToBeApplied && couponToBeApplied[0]
            ? couponToBeApplied[0].id
            : null,
      },
      theme: {
        color: "#538BF7",
      },
    };
    var paymentObject = new window.Razorpay(options);

    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const renderTicketsList = (tickets) => {
    return tickets.map((ticket) => {
      const price = ticket.price;

      return (
        <div className="ticket-card mb-2 px-3 py-4">
          <div className="d-flex flex-row align-items-center">
            <RoyalBlueRadio
              color="primary"
              style={{ fill: "#538BF7", maxHeight: "fit-content" }}
              checked={selectedTicket === ticket.id}
              onChange={handleChange}
              value={ticket.id}
              name="radio-button-demo"
              inputProps={{ "aria-label": "A" }}
            />
          </div>
          <div className="ticket-name-and-description">
            <div className="ticket-name mb-1">{ticket.name}</div>
            <div className="ticket-description">{ticket.description}</div>
          </div>
          {ticket.ticketIsSoldOut ? (
            <div className="ticket-sold-out-text">Sold out</div>
          ) : (
            <div className="ticket-price">
              <b>Rs.{(price * 1) / (factor * 1)}</b>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      <div
        className="ticket-column mb-3"
        style={{
          maxHeight: "355px",
          overflowY: "scroll",
          background: "rgba( 255, 255, 255, 0.8 )",
          boxShadow: "0 8px 32px 0 rgba( 225, 225, 225, 0.25 )",

          borderRadius: "10px",
          border: "1px solid rgba( 255, 255, 255, 0.18 )",
        }}
      >
        {renderTicketsList(tickets)}
      </div>

      <hr className="mb-3" />
      <div className="mb-4">
        <div
          className="got-a-coupon-code mb-3"
          style={{ fontWeight: "500", fontFamily: "Inter" }}
        >
          Got a coupon code?
        </div>
        <div
          class="form-inline my-2 my-lg-0 d-flex flex-row mb-5 px-5"
          style={{ width: "100%" }}
        >
          <input
            style={{ textTransform: "uppercase" }}
            className="form-control mr-sm-2"
            type="search"
            placeholder="Coupon code"
            aria-label="Search"
            value={couponText}
            name="coupon"
            onChange={handleCouponChange}
          />
          <button
            class="btn btn-outline-primary my-2 my-sm-0 btn-outline-text"
            onClick={handleCouponValidation}
        
          >
            Apply
          </button>
        </div>
      </div>

      <div className="reserve-your-spot">
        <div>
          <button
            // disabled={!isSignedIn}
        
            class="btn btn-primary btn-outline-text"
            onClick={displayRazorpay}
            // onClick={ community.paymentGateway === "Paypal" ? handleRegistrationUsingPaypal : displayRazorpay}
          >
            Reserve Your Spot
          </button>
        </div>
        <div className="col" style={{ marginTop: "4%", padding: "0" }}>
          {" "}
          <Link to={`/signin/${eventId}/?intent=eventRegistration`}>
            {" "}
            {isSignedIn ? (
              <div></div>
            ) : (
              <span style={{ color: "#11A1FD" }}>
                Login to register for this event.
              </span>
            )}
          </Link>
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openSuccess}
        onClose={handleCloseSuccess}
        autoHideDuration={4000}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          autoHideDuration={4000}
        >
          Coupon applied successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{
          verticalRegistrationSuccess,
          horizontalRegistrationSuccess,
        }}
        open={openRegistrationSuccess}
        onClose={handleCloseRegistrationSuccess}
        autoHideDuration={4000}
      >
        <Alert onClose={handleCloseRegistrationSuccess} severity="success">
          Your registration was successful!
        </Alert>
      </Snackbar>
    </>
  );
};

export default TicketForm;
