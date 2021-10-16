/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Radio from "@material-ui/core/Radio";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import {
  getEventRegistrationCheckoutSession,
  showSnackbar,
} from "../../../actions";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";

const TwoButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 24px;
`;

const { REACT_APP_MY_ENV } = process.env;
const BaseURL = REACT_APP_MY_ENV
  ? "http://localhost:3000/api-eureka/eureka/v1/"
  : "https://api.bluemeet.in/api-eureka/eureka/v1/";

const RoyalBlueRadio = withStyles({
  root: {
    color: "#538BF7",
    "&$checked": {
      color: "#3372F0",
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const TicketForm = ({isCommunityTeamMember, eventId, tickets, coupon }) => {
  const params = useParams();
  const currentEventId = params.id;

  const isSignedIn = useSelector((state) => state.auth.isSignedIn);

  let alreadyRegistered = false; // Boolean flag

  const userToken = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.user.userDetails);
  const userDetails = useSelector((state) => state.user.userDetails);

  if (isSignedIn) {
    // get list of all events in which attendee is registered.
    // compare if eventId is included in users registered events array.
    if (userDetails) {
      if (userDetails.registeredInEvents) {
        const EventsIdsArray = userDetails.registeredInEvents.map(
          (el) => el._id
        );
        if (EventsIdsArray.includes(currentEventId)) {
          alreadyRegistered = true;
        }
      }
    }

    // if yes then don't allow to register again

    // else leave it in normal state.
  }

  const event = useSelector((state) => {
    return state.event.eventDetails;
  });

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
      showSnackbar("success", "Coupon applied successfully!");
    } else {
      setFactor(1);
      showSnackbar("error", "Invalid coupon code.");
    }
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
          className="form-inline my-2 my-lg-0 d-flex flex-row mb-5 px-5"
          style={{ width: "100%" }}
        >
          <input
          disabled={isCommunityTeamMember || alreadyRegistered}
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
          disabled={isCommunityTeamMember || alreadyRegistered}
            className="btn btn-outline-primary my-2 my-sm-0 btn-outline-text"
            onClick={handleCouponValidation}
          >
            Apply
          </button>
        </div>
      </div>

      {/* // TODO Remember to show a message that you are already registerd for this event. */}

      <div className="reserve-your-spot">
        {isCommunityTeamMember ?  <div className="d-flex flex-row align-items-center justify-content-center">  <button style={{width: "330px"}} className="btn btn-outline-text btn-primary d-flex flex-row align-items-center justify-content-center">
              <TodayRoundedIcon className="me-2" />
              <span>Add to calender</span>
            </button> </div> :   alreadyRegistered === true ? (
          <TwoButtonsGrid
            className=""
            style={{
              maxWidth: "470px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {/* Show visit event button and add to calander button to attendee*/}
            <button className="btn btn-outline-text btn-outline-primary">
              Join event
            </button>
            <button className="btn btn-outline-text btn-primary d-flex flex-row align-items-center justify-content-center">
              <TodayRoundedIcon className="me-2" />
              <span>Add to calender</span>
            </button>
          </TwoButtonsGrid>
        ) : (
          <div>
            <button
              className="btn btn-primary btn-outline-text mb-3"
              onClick={getEventRegistrationCheckoutSession({
                eventId: eventId,
                ticketId: selectedTicket,
                communityId: event.createdBy._id,
                transaction_type: "event_registration",
                userId: user._id,
                couponId:
                  couponToBeApplied && couponToBeApplied[0]
                    ? couponToBeApplied[0].id
                    : null,
              })}
            >
              Reserve Your Spot
            </button>
          </div>
        )  }
      

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
    </>
  );
};

export default TicketForm;
