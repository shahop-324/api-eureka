import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Radio from "@material-ui/core/Radio";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import {
  fetchEventCoupons,
  getEventRegistrationCheckoutSession,
  showNotification,
} from "../../../actions";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import AddToCalender from "../HelperComponent/AddTocalender";
import Chip from "@mui/material/Chip";

import { useDispatch } from "react-redux";

const TwoButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 24px;
`;

const TicketTitle = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
  color: #212121;
`;

const TicketBrief = styled.div`
  font-weight: 400;
  font-size: 0.85rem;
  color: #212121;
`;

const TicketPrice = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: #212121;
`;

const RoyalBlueRadio = withStyles({
  root: {
    color: "#538BF7",
    "&$checked": {
      color: "#3372F0",
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const TicketForm = ({
  isCommunityTeamMember,
  eventId,
  tickets,
  coupon,
  eventName,
  eventDescription,
  startTime,
  endTime,
}) => {
  const dispatch = useDispatch();
  const params = useParams();
  const currentEventId = params.id;

  useEffect(() => {
    dispatch(fetchEventCoupons(eventId));
  }, []);

  const { coupons } = useSelector((state) => state.coupon);

  const calendarEvent = {
    title: eventName,
    description: eventDescription,
    start: new Date(startTime),
    end: new Date(endTime),
  };

  const [openCalender, setOpenCalender] = React.useState(false);

  const handleCloseAddToCalender = () => {
    setOpenCalender(false);
  };

  const isSignedIn = useSelector((state) => state.auth.isSignedIn);

  let alreadyRegistered = false; // Boolean flag

  const user = useSelector((state) => state.user.userDetails);
  const userDetails = useSelector((state) => state.user.userDetails);

  if (isSignedIn) {
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
  }

  const event = useSelector((state) => {
    return state.event.eventDetails;
  });

  const couponsArray =
    coupons &&
    coupons.map((coupon) => {
      return {
        id: coupon.id,
        code: coupon.discountCode,
        percentage: coupon.discountPercentage,
        validTillTime: coupon.validTillTime,
        startTime: coupon.startTime,
        tickets: coupon.tickets,
      };
    });

  const [factor, setFactor] = useState(1);

  const [selectedTicket, setSelectedTicket] = React.useState(null);

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
    // alert("entered in coupon validation");

    // Coupon will only be applicable on certain ticket in certain timeline

    // Priority No. 1 => Timeline
    // Priority No. 2 => Applicable tickets

    if (!selectedTicket) {
      dispatch(showNotification("Please select a ticket apply coupon"));
    }

    console.log(couponText);
    console.log(couponsArray);
    const validatedCoupon = couponsArray.filter(
      (coupon) => couponText === coupon.code
    );

    setCouponToBeApplied(validatedCoupon);

    const bool = validatedCoupon.length > 0;
    console.log(bool);
    const validationStatus = !bool ? "Not valid" : "valid";
    console.log(validationStatus);

    let coupon = validatedCoupon[0];

    if (bool) {
      if (
        new Date(Date.now()) >= new Date(coupon.startTime) &&
        new Date(Date.now()) <= new Date(coupon.validTillTime)
      ) {
        if (coupon.tickets.includes(selectedTicket)) {
          // Only in this case coupon will be applicable
          setFactor((100 / (100 - validatedCoupon[0].percentage * 1)) * 1);
          dispatch(showNotification("Coupon applied successfully!"));
        } else {
          setFactor(1);
          dispatch(
            showNotification("Coupon not applicable on selected ticket.")
          );
        }
      } else {
        setFactor(1);
        dispatch(showNotification("Coupon not applicable currently."));
      }
    } else {
      setFactor(1);
      dispatch(showNotification("Invalid coupon code."));
    }
  };

  const renderTicketsList = (tickets) => {
    return tickets.map((ticket) => {
      const price = ticket.price;

      // only allow ticket to be purchased when its within sales timeline

      let isTicketOnSale = false;

      if (
        new Date(Date.now()) >= new Date(ticket.salesStartTime) &&
        new Date(Date.now()) <= new Date(ticket.salesEndTime)
      ) {
        isTicketOnSale = true;
      }

      // console.log(new Date(Date.now()));
      // console.log(new Date(ticket.salesStartTime));
      // console.log(new Date(ticket.salesEndTime));

      console.log(ticket.id, ticket.name, "This is ticket Id");

      return (
        <div className="ticket-card mb-2 px-3 py-4">
          <div className="d-flex flex-row align-items-center">
            <RoyalBlueRadio
              color="primary"
              disabled={!isTicketOnSale}
              style={{ fill: "#538BF7", maxHeight: "fit-content" }}
              checked={isTicketOnSale ? selectedTicket === ticket.id : false}
              onChange={handleChange}
              value={ticket.id}
              name="radio-button-demo"
              inputProps={{ "aria-label": "A" }}
            />
          </div>
          <div className="ticket-name-and-description">
            <TicketTitle className="ticket-name mb-1">
              {ticket.name}
            </TicketTitle>
            <TicketBrief className="ticket-description">
              {ticket.description}
            </TicketBrief>
          </div>
          {!isTicketOnSale ? (
            <Chip
              label="Sale off"
              color="warning"
              variant="outlined"
              style={{ fontWeight: "500" }}
            />
          ) : ticket.soldOut ? (
            <Chip
              label="Sold out"
              color="error"
              variant="outlined"
              style={{ fontWeight: "500" }}
            />
          ) : (
            <TicketPrice
              className="ticket-price"
              style={{ textAlign: "center" }}
            >
              {(() => {
                switch (ticket.type) {
                  case "Paid":
                    return <b>${(price * 1) / (factor * 1)}</b>;

                  case "Free":
                    return (
                      <Chip label="Free" color="primary" variant="outlined" />
                    );

                  case "Donation":
                    return (
                      <Chip
                        label="Donation"
                        color="primary"
                        variant="outlined"
                      />
                    );

                  default:
                    break;
                }
              })()}
            </TicketPrice>
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
            disabled={
              (selectedTicket ? selectedTicket.type === "Free" : true) ||
              isCommunityTeamMember ||
              alreadyRegistered
            }
            // style={{ textTransform: "uppercase" }}
            className="form-control mr-sm-2"
            type="search"
            placeholder="Coupon code"
            aria-label="Search"
            value={couponText}
            name="coupon"
            onChange={handleCouponChange}
          />
          <button
            disabled={
              (selectedTicket ? selectedTicket.type === "Free" : true) ||
              isCommunityTeamMember ||
              alreadyRegistered
            }
            className="btn btn-outline-primary my-2 my-sm-0 btn-outline-text"
            onClick={() => {
              if (!selectedTicket) {
                dispatch(
                  showNotification("Please select a ticket to apply coupon.")
                );
              } else {
                handleCouponValidation();
              }
            }}
          >
            Apply
          </button>
        </div>
      </div>

      {/* // TODO Remember to show a message that you are already registerd for this event. */}

      <div className="reserve-your-spot">
        {isCommunityTeamMember ? (
          <div className="d-flex flex-row align-items-center justify-content-center">
            {" "}
            <button
              onClick={() => {
                setOpenCalender(true);
              }}
              style={{ width: "330px" }}
              className="btn btn-outline-text btn-primary d-flex flex-row align-items-center justify-content-center"
            >
              <TodayRoundedIcon className="me-2" />
              <span>Add to calender</span>
            </button>{" "}
          </div>
        ) : alreadyRegistered === true ? (
          <TwoButtonsGrid
            className=""
            style={{
              maxWidth: "470px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <button className="btn btn-outline-text btn-outline-primary">
              Join event
            </button>
            <button
              onClick={() => {
                setOpenCalender(true);
              }}
              className="btn btn-outline-text btn-primary d-flex flex-row align-items-center justify-content-center"
            >
              <TodayRoundedIcon className="me-2" />
              <span>Add to calender</span>
            </button>
          </TwoButtonsGrid>
        ) : (
          <div>
            <button
              disabled={!selectedTicket}
              className="btn btn-primary btn-outline-text mb-3"
              onClick={() => {
                if (!selectedTicket) {
                  dispatch(showNotification("Please select a ticket."));
                } else {
                  if (isSignedIn) {
                    if (selectedTicket.type === "Paid") {
                      // open razorpay window
                      //   eventId: eventId,
                      //   ticketId: selectedTicket,
                      //   communityId: event.createdBy._id,
                      //   transaction_type: "event_registration",
                      //   userId: user._id,
                      //   couponId:
                      //     couponToBeApplied && couponToBeApplied[0]
                      //       ? couponToBeApplied[0].id
                      //       : null,
                    }
                    if (selectedTicket.type === "Free") {
                      // Register manually
                      //   eventId: eventId,
                      //   ticketId: selectedTicket,
                      //   communityId: event.createdBy._id,
                      //   transaction_type: "event_registration",
                      //   userId: user._id,
                      //   couponId:
                      //     couponToBeApplied && couponToBeApplied[0]
                      //       ? couponToBeApplied[0].id
                      //       : null,
                    }
                  } else {
                    // Please sign in to register for this event
                    dispatch(
                      showNotification(
                        "Please sign in to register for this event."
                      )
                    );
                  }
                }

                // getEventRegistrationCheckoutSession({
                //   eventId: eventId,
                //   ticketId: selectedTicket,
                //   communityId: event.createdBy._id,
                //   transaction_type: "event_registration",
                //   userId: user._id,
                //   couponId:
                //     couponToBeApplied && couponToBeApplied[0]
                //       ? couponToBeApplied[0].id
                //       : null,
                // })
              }}
            >
              Reserve Your Spot
            </button>
          </div>
        )}

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
      <AddToCalender
        event={calendarEvent}
        open={openCalender}
        handleClose={handleCloseAddToCalender}
      />
    </>
  );
};

export default TicketForm;
